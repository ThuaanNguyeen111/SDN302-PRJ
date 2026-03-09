import { Router } from 'express'
import { createMoMoPaymentController } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const paymentsRouters = Router()

/**
 * @description: Tạo link thanh toán MoMo
 * @method: POST /api/payments/create-url
 * @body { order_id: string, amount: number }
 */
paymentsRouters.post(
  '/create-url',
  accessTokenValidator, // Bắt buộc đăng nhập mới được tạo link thanh toán
  WarpAsync(createMoMoPaymentController)
)

export default paymentsRouters
