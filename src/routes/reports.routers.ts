import { Router } from 'express'
import {
  createReportController,
  getPendingReportsController,
  resolveReportController
} from '~/controllers/reports.controllers'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
import { createReportValidator, resolveReportValidator } from '~/middlewares/reports.middlewares'
import { isStaffOrAdminValidator } from '~/middlewares/orders.middlewares'
import { WarpAsync } from '~/utils/handlers'

// ===== MEMBER ROUTES =====
const reportsRouters = Router()

/**
 * @description: Gửi report mới (Member)
 * @method: POST /api/reports
 */
reportsRouters.post(
  '/',
  accessTokenValidator,
  verifyfiedUserValidator,
  createReportValidator,
  WarpAsync(createReportController)
)

// ===== ADMIN/STAFF ROUTES =====
export const adminReportsRouters = Router()

/**
 * @description: Xem danh sách report đang chờ (Staff/Admin)
 * @method: GET /api/admin/reports
 */
adminReportsRouters.get(
  '/reports',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  WarpAsync(getPendingReportsController)
)

/**
 * @description: Đánh dấu report đã giải quyết (Staff/Admin)
 * @method: PATCH /api/admin/reports/:id
 */
adminReportsRouters.patch(
  '/reports/:id',
  accessTokenValidator,
  verifyfiedUserValidator,
  isStaffOrAdminValidator,
  resolveReportValidator,
  WarpAsync(resolveReportController)
)

export default reportsRouters
