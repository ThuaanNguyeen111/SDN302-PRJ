import express from 'express'
import { UserRole } from '~/constants/enums'
import {
  DeleteUserController,
  getAllUsersController,
  getMeControllerAdmin,
  updateMeAdminController
} from '~/controllers/admin.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { requireRole } from '~/middlewares/requireRole.middlewares'
import { accessTokenValidator, updateMeValidator } from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/request/user.requests'

import { WarpAsync } from '~/utils/handlers'

const adminRouters = express.Router()

//!-----------------------------------------------------------------------------------------------------------|

/**
 * @description Endpoint for admin to retrieve all accounts including users, staffs, and admins.
 * @endpoint GET /admin/getAllUser
 * @authentication Requires valid access token.
 * @headers {
 *   Authorization: "Bearer <access_token>"
 * }
 * @authorization Only accessible by Admin role.
 
 */
//!-----------------------------------------------------------------------------------------------------------|
adminRouters.get('/getAllUser', accessTokenValidator, WarpAsync(getAllUsersController))
//!-----------------------------------------------------------------------------------------------------------|

/**
 * @description Endpoint for admin to delete a user account and its associated refresh token.
 * @endpoint DELETE /admin/deleteUser/:user_id (http://localhost:4000/admins/deleteUser/68581c882738d46ff3c2664f)
 * @authentication Requires valid access token.
 * @authorization Only accessible by Admin role.
 *@responseBody {
 *   message: string // e.g., "Delete successful"
 * }
 * @throws 500 for unexpected errors during deletion.
 */

//!-----------------------------------------------------------------------------------------------------------|
adminRouters.delete('/deleteUser/:user_id', accessTokenValidator, WarpAsync(DeleteUserController))
//!-----------------------------------------------------------------------------------------------------------|

/**
 * @description Lấy thông tin chi tiết tài khoản của một user bất kỳ theo ID (bao gồm user, staff, admin).
 * @endpoint GET /api/admins/me/:user_id ({{host}}/admins/me/6839bdac4e8248b327756c73)
 * @accessToken Yêu cầu access_token hợp lệ của admin (kiểm tra trong headers)
 * @requireRole Admin (chỉ Admin được quyền truy cập)
 * @params
 *    user_id: string - MongoDB ObjectId (24 ký tự hex)
 * @response {
 *   message: string,
 *   result: {
 *     _id: string,
 *     name: string,
 *     email: string,
 *     ... // Các thông tin khác tuỳ vào loại tài khoản (user/staff/admin)
 *   }
 * }
 
 */
//!-------------------------------------------------------------------------------------------------|
adminRouters.get('/me/:user_id', accessTokenValidator, WarpAsync(getMeControllerAdmin))

//!------------------------------------------------------------------------------------------------------------|
adminRouters.patch(
  '/me/:user_id',
  accessTokenValidator,
  filterMiddleware<UpdateMeReqBody>(['name', 'date_of_birth', 'gender', 'address', 'avatar']),
  updateMeValidator,
  WarpAsync(updateMeAdminController)
)
export default adminRouters
