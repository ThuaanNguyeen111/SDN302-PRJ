import { Router } from 'express'
import {
  checkVoucherController,
  createVoucherController,
  getAllVouchersController
} from '~/controllers/vouchers.controllers'
import { checkVoucherValidator, createVoucherValidator } from '~/middlewares/vouchers.middlewares'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
// Giả sử bạn đã tạo isStaffOrAdminValidator ở bài trước và đặt nó trong orders.middlewares hoặc common.middlewares
import { isStaffOrAdminValidator } from '~/middlewares/orders.middlewares'
import { WarpAsync } from '~/utils/handlers'

const vouchersRouters = Router()

/**
 * @description: API quan trọng để Frontend check mã trước khi thanh toán
 * @method: POST /vouchers/check
 */
vouchersRouters.post(
  '/check',
  accessTokenValidator,
  verifyfiedUserValidator,
  checkVoucherValidator,
  WarpAsync(checkVoucherController)
)

/**
 * @description: Liệt kê các mã khuyến mãi (Staff/Admin)
 * @method: GET /vouchers
 */
vouchersRouters.get(
  '/',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  WarpAsync(getAllVouchersController)
)

/**
 * @description: Tạo mã voucher mới (Staff/Admin)
 * @method: POST /vouchers
 */
vouchersRouters.post(
  '/',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  createVoucherValidator,
  WarpAsync(createVoucherController)
)

export default vouchersRouters
