import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Reward from '~/models/schema/reward.schemas'
import PointHistory from '~/models/schema/pointHistory.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { REWARD_MESSAGES } from '~/constants/message'

class RewardService {
  //!-------------------------------------------------------------------------------------------------|
  // 0. TẠO REWARD (Staff/Admin)
  async createReward(payload: any) {
    const isExist = await DatabaseService.rewards.findOne({ name: payload.name })
    if (isExist) {
      throw new ErrorWithStatus({
        message: REWARD_MESSAGES.REWARD_ALREADY_EXISTS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const newReward = new Reward({ ...payload })
    await DatabaseService.rewards.insertOne(newReward)
    return { ...newReward }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 1. LẤY DANH SÁCH QUÀ CÓ THỂ ĐỔI (Guest/Member)
  async getRewards() {
    const rewards = await DatabaseService.rewards
      .find({ status: 'active', stock: { $gt: 0 } })
      .sort({ points_required: 1 }) // Món ít điểm xếp lên trên
      .toArray()
    return rewards
  }

  //!-------------------------------------------------------------------------------------------------|
  // 2. ĐỔI ĐIỂM LẤY QUÀ (Member) - LOGIC MỚI ĐÃ SỬA
  async redeemReward(user_id: string, reward_id: string) {
    // 1. Tìm thông tin quà tặng
    const reward = await DatabaseService.rewards.findOne({
      _id: new ObjectId(reward_id),
      status: 'active'
    })

    if (!reward) {
      throw new ErrorWithStatus({ message: REWARD_MESSAGES.REWARD_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    if (reward.stock <= 0) {
      throw new ErrorWithStatus({ message: REWARD_MESSAGES.REWARD_OUT_OF_STOCK, status: HTTP_STATUS.BAD_REQUEST })
    }

    // 2. Lấy thông tin User hiện tại để kiểm tra số dư điểm
    const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({ message: 'User không tồn tại', status: HTTP_STATUS.NOT_FOUND })
    }

    const currentPoints = user.accumulated_points || 0 // Điểm hiện có của user

    // 3. Kiểm tra xem user có đủ điểm đổi món quà này không?
    if (currentPoints < reward.points_required) {
      throw new ErrorWithStatus({
        message: 'Bạn không đủ điểm để đổi món quà này!', // Báo lỗi không đủ điểm
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // 4. Bắt đầu xử lý Giao dịch (Transaction-like)
    // 4.1. Trừ số lượng kho của món quà
    await DatabaseService.rewards.updateOne(
      { _id: new ObjectId(reward_id) },
      {
        $inc: { stock: -1 },
        $set: { updated_at: new Date() }
      }
    )

    // 4.2. TRỪ ĐIỂM TÍCH LŨY CỦA USER (Quan trọng)
    await DatabaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $inc: { accumulated_points: -reward.points_required } } // Dùng $inc số âm để trừ điểm
    )

    // 4.3. Tạo bản ghi lịch sử trừ điểm
    const pointHistory = new PointHistory({
      user_id: new ObjectId(user_id),
      action: 'redeem',
      points: reward.points_required,
      description: `Đổi quà: ${reward.name}`,
      reward_id: new ObjectId(reward_id)
    })
    await DatabaseService.pointHistories.insertOne(pointHistory)

    // 5. Trả kết quả về
    return {
      reward_name: reward.name,
      points_used: reward.points_required,
      remaining_points: currentPoints - reward.points_required // Tính điểm còn lại cho User thấy
    }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 3. XEM LỊCH SỬ ĐIỂM (Member)
  async getPointHistory(user_id: string) {
    // Lấy lịch sử giao dịch (cả nhận và trừ)
    const history = await DatabaseService.pointHistories
      .find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 })
      .toArray()

    // Lấy số dư điểm HIỆN TẠI trực tiếp từ bảng User
    const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })
    const totalPoints = user?.accumulated_points || 0

    return {
      total_points: totalPoints,
      history
    }
  }
}

const RewardServices = new RewardService()
export default RewardServices
