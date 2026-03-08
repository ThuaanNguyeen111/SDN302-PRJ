import { Router } from 'express'
import {
  createRewardController,
  getRewardsController,
  redeemRewardController,
  getPointHistoryController
} from '~/controllers/rewards.controllers'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
import { createRewardValidator, redeemRewardValidator } from '~/middlewares/rewards.middlewares'
import { isStaffOrAdminValidator } from '~/middlewares/orders.middlewares'
import { WarpAsync } from '~/utils/handlers'

const rewardsRouters = Router()

/**
 * @description: Xem danh sách quà có thể đổi (Guest/Member — không cần đăng nhập)
 * @method: GET /api/rewards
 */
rewardsRouters.get('/', WarpAsync(getRewardsController))

/**
 * @description: Tạo reward mới (Staff/Admin)
 * @method: POST /api/rewards
 */
rewardsRouters.post(
  '/',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  createRewardValidator,
  WarpAsync(createRewardController)
)

/**
 * @description: Đổi điểm lấy quà (Member — cần đăng nhập và đã verify email)
 * @method: POST /api/rewards/redeem
 */
rewardsRouters.post(
  '/redeem',
  accessTokenValidator,
  verifyfiedUserValidator,
  redeemRewardValidator,
  WarpAsync(redeemRewardController)
)

/**
 * @description: Xem lịch sử cộng/trừ điểm tích lũy (Member)
 * @method: GET /api/users/points — được mount riêng ở index.ts
 */
export const pointHistoryRouter = Router()
pointHistoryRouter.get(
  '/points',
  accessTokenValidator,
  verifyfiedUserValidator,
  WarpAsync(getPointHistoryController)
)

export default rewardsRouters
