import { Router } from 'express'
import { createReviewController } from '~/controllers/reviews.controllers'
import { createReviewValidator } from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const reviewsRouters = Router()

/**
 * @description: Member gửi đánh giá sau khi mua hàng
 * @method: POST /api/reviews/:productId
 */
reviewsRouters.post(
  '/:productId',
  accessTokenValidator, // Bắt buộc đăng nhập
  verifyfiedUserValidator, // Bắt buộc xác thực
  createReviewValidator, // Validate form
  WarpAsync(createReviewController)
)

export default reviewsRouters
