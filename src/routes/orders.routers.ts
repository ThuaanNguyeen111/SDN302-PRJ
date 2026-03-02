import { Router } from 'express'
import {
  createOrderController,
  getMyOrdersController,
  updateOrderStatusController,
  getOrderByIdController, // <- Thêm cái này
  getAllOrdersController // <- Thêm cái này
} from '~/controllers/orders.controllers'
import { createOrderValidator, isStaffOrAdminValidator } from '~/middlewares/orders.middlewares'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const ordersRouters = Router()

/**
 * @description: Create a new order
 * @method: POST /orders
 */
ordersRouters.post(
  '/',
  accessTokenValidator,
  verifyfiedUserValidator,
  createOrderValidator,
  WarpAsync(createOrderController)
)

/**
 * @description: Get member's order history
 * @method: GET /orders/my-orders
 */
ordersRouters.get('/my-orders', accessTokenValidator, verifyfiedUserValidator, WarpAsync(getMyOrdersController))

/**
 * @description: Update order status (Staff/Admin only)
 * @method: PATCH /orders/:order_id/status
 */
ordersRouters.patch(
  '/:order_id/status',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  WarpAsync(updateOrderStatusController)
)
/**
 * @description: Danh sách tất cả đơn hàng để xử lý (Dành cho Staff/Admin)
 * @method: GET /orders/all (Tương đương /api/admin/orders của bạn)
 */
ordersRouters.get(
  '/all', // Bạn có thể đặt là '/admin/all' tùy ý
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator, // <-- Chặn member thường ở đây
  WarpAsync(getAllOrdersController)
)

/**
 * @description: Xem chi tiết một đơn hàng cụ thể
 * @method: GET /orders/:order_id
 */
ordersRouters.get('/:order_id', accessTokenValidator, verifyfiedUserValidator, WarpAsync(getOrderByIdController))
export default ordersRouters
