import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController
} from '~/controllers/products.controllers'
import { createProductValidator, updateProductValidator } from '~/middlewares/products.middleware'
import { requireRole } from '~/middlewares/requireRole.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const productRouters = Router()

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Lấy danh sách tất cả sản phẩm (Guest có thể xem, không cần access token)
 * @endpoint GET /api/products
 */
productRouters.get('/', WarpAsync(getAllProductsController))

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Xem chi tiết 1 sản phẩm theo ID (Guest có thể xem, không cần access token)
 * @endpoint GET /api/products/:id
 * @params id - MongoDB ObjectId của sản phẩm
 */
productRouters.get('/:id', WarpAsync(getProductByIdController))

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Thêm sản phẩm mới (Staff/Admin)
 * @endpoint POST /api/products
 * @requestBody { name, description?, category?, price, stock_quantity, image_url?, brand?, age_range? }
 */
productRouters.post(
  '/',
  accessTokenValidator,
  requireRole(UserRole.Staff, UserRole.Admin),
  createProductValidator,
  WarpAsync(createProductController)
)

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Cập nhật thông tin sản phẩm (Staff/Admin)
 * @endpoint PUT /api/products/:id
 * @params id - MongoDB ObjectId của sản phẩm
 * @requestBody { name?, description?, category?, price?, stock_quantity?, image_url?, brand?, age_range? }
 */
productRouters.put(
  '/:id',
  accessTokenValidator,
  requireRole(UserRole.Staff, UserRole.Admin),
  updateProductValidator,
  WarpAsync(updateProductController)
)

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Xóa sản phẩm (chỉ Admin)
 * @endpoint DELETE /api/products/:id
 * @params id - MongoDB ObjectId của sản phẩm
 */
productRouters.delete(
  '/:id',
  accessTokenValidator,
  requireRole(UserRole.Admin),
  WarpAsync(deleteProductController)
)

export default productRouters
