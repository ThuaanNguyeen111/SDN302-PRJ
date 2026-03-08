import { Request, Response } from 'express'
import { REWARD_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.requests'
import RewardServices from '~/services/rewards.services'

//!-------------------------------------------------------------------------------------------------|
// POST /api/rewards — Tạo quà mới (Staff/Admin)
export const createRewardController = async (req: Request, res: Response) => {
  const result = await RewardServices.createReward(req.body)
  return res.json({
    message: REWARD_MESSAGES.CREATE_REWARD_SUCCESS,
    result
  })
}

//!-------------------------------------------------------------------------------------------------|
// GET /api/rewards — Xem danh sách quà có thể đổi (Guest/Member)
export const getRewardsController = async (req: Request, res: Response) => {
  const result = await RewardServices.getRewards()
  return res.json({
    message: REWARD_MESSAGES.GET_REWARDS_SUCCESS,
    result
  })
}

//!-------------------------------------------------------------------------------------------------|
// POST /api/rewards/redeem — Đổi điểm lấy quà (Member)
export const redeemRewardController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { reward_id } = req.body
  const result = await RewardServices.redeemReward(user_id, reward_id)
  return res.json({
    message: REWARD_MESSAGES.REDEEM_SUCCESS,
    result
  })
}

//!-------------------------------------------------------------------------------------------------|
// GET /api/users/points — Xem lịch sử điểm tích lũy (Member)
export const getPointHistoryController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await RewardServices.getPointHistory(user_id)
  return res.json({
    message: REWARD_MESSAGES.GET_POINT_HISTORY_SUCCESS,
    result
  })
}
