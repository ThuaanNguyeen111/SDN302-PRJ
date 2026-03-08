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

    const newReward = new Reward({
      ...payload
    })

    await DatabaseService.rewards.insertOne(newReward)
    return { ...newReward }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 1. LẤY DANH SÁCH QUÀ CÓ THỂ ĐỔI (Guest/Member)
  async getRewards() {
    const rewards = await DatabaseService.rewards
      .find({ status: 'active', stock: { $gt: 0 } })
      .sort({ points_required: 1 })
      .toArray()
    return rewards
  }

  //!-------------------------------------------------------------------------------------------------|
  // 2. ĐỔI ĐIỂM LẤY QUÀ (Member)
  async redeemReward(user_id: string, reward_id: string) {
    // Tìm reward
    const reward = await DatabaseService.rewards.findOne({
      _id: new ObjectId(reward_id),
      status: 'active'
    })

    if (!reward) {
      throw new ErrorWithStatus({
        message: REWARD_MESSAGES.REWARD_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (reward.stock <= 0) {
      throw new ErrorWithStatus({
        message: REWARD_MESSAGES.REWARD_OUT_OF_STOCK,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Tính tổng điểm hiện tại của user
    const currentPoints = await this.getUserTotalPoints(user_id)

    if (currentPoints < reward.points_required) {
      throw new ErrorWithStatus({
        message: REWARD_MESSAGES.NOT_ENOUGH_POINTS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Trừ stock của reward
    await DatabaseService.rewards.updateOne(
      { _id: new ObjectId(reward_id) },
      {
        $inc: { stock: -1 },
        $set: { updated_at: new Date() }
      }
    )

    // Tạo bản ghi trừ điểm
    const pointHistory = new PointHistory({
      user_id: new ObjectId(user_id),
      action: 'redeem',
      points: reward.points_required,
      description: `Đổi quà: ${reward.name}`,
      reward_id: new ObjectId(reward_id)
    })

    await DatabaseService.pointHistories.insertOne(pointHistory)

    return {
      reward_name: reward.name,
      points_used: reward.points_required,
      remaining_points: currentPoints - reward.points_required
    }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 3. XEM LỊCH SỬ ĐIỂM (Member)
  async getPointHistory(user_id: string) {
    const history = await DatabaseService.pointHistories
      .find({ user_id: new ObjectId(user_id) })
      .sort({ created_at: -1 })
      .toArray()

    const totalPoints = await this.getUserTotalPoints(user_id)

    return {
      total_points: totalPoints,
      history
    }
  }

  //!-------------------------------------------------------------------------------------------------|
  // HELPER: Tính tổng điểm hiện tại của user
  async getUserTotalPoints(user_id: string): Promise<number> {
    const result = await DatabaseService.pointHistories
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        {
          $group: {
            _id: null,
            earned: {
              $sum: { $cond: [{ $eq: ['$action', 'earn'] }, '$points', 0] }
            },
            redeemed: {
              $sum: { $cond: [{ $eq: ['$action', 'redeem'] }, '$points', 0] }
            }
          }
        }
      ])
      .toArray()

    if (result.length === 0) return 0
    return result[0].earned - result[0].redeemed
  }
}

const RewardServices = new RewardService()
export default RewardServices
