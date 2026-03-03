import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  updatePostController
} from '~/controllers/posts.controllers'
import { createPostValidator, updatePostValidator } from '~/middlewares/posts.middleware'
import { requireRole } from '~/middlewares/requireRole.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const postRouters = Router()

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Lấy danh sách bài viết sức khỏe (Guest có thể xem, không cần access token)
 * @endpoint GET /api/posts
 */
postRouters.get('/', WarpAsync(getAllPostsController))

//!-------------------------------------------------------------------------------------------------|
/**
 * @description Xem chi tiết bài viết + danh sách sản phẩm gợi ý đính kèm
 * @endpoint GET /api/posts/:id
 * @params id - MongoDB ObjectId của bài viết
 */
postRouters.get('/:id', WarpAsync(getPostByIdController))

//!-------------------------------------------------------------------------------------------------|
/**
 * @description (Staff) Đăng bài viết mới
 * @endpoint POST /api/posts
 * @requestBody { title, content, thumbnail?, suggested_products?, tags?, status? }
 */
postRouters.post(
  '/',
  accessTokenValidator,
  requireRole(UserRole.Staff, UserRole.Admin),
  createPostValidator,
  WarpAsync(createPostController)
)

//!-------------------------------------------------------------------------------------------------|
/**
 * @description (Staff) Chỉnh sửa bài viết
 * @endpoint PUT /api/posts/:id
 * @params id - MongoDB ObjectId của bài viết
 * @requestBody { title?, content?, thumbnail?, suggested_products?, tags?, status? }
 */
postRouters.put(
  '/:id',
  accessTokenValidator,
  requireRole(UserRole.Staff, UserRole.Admin),
  updatePostValidator,
  WarpAsync(updatePostController)
)

export default postRouters
