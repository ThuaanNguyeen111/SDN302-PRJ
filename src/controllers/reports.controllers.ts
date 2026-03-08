import { Request, Response } from 'express'
import { REPORT_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.requests'
import ReportServices from '~/services/reports.services'

//!-------------------------------------------------------------------------------------------------|
// POST /api/reports — Gửi report (Member)
export const createReportController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await ReportServices.createReport(user_id, req.body)
  return res.json({
    message: REPORT_MESSAGES.CREATE_REPORT_SUCCESS,
    result
  })
}

//!-------------------------------------------------------------------------------------------------|
// GET /api/admin/reports — Xem danh sách report đang chờ (Staff)
export const getPendingReportsController = async (req: Request, res: Response) => {
  const result = await ReportServices.getPendingReports()
  return res.json({
    message: REPORT_MESSAGES.GET_REPORTS_SUCCESS,
    result
  })
}

//!-------------------------------------------------------------------------------------------------|
// PATCH /api/admin/reports/:id — Đánh dấu report đã giải quyết (Staff)
export const resolveReportController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { id } = req.params
  const result = await ReportServices.resolveReport(id, user_id, req.body)
  return res.json({
    message: REPORT_MESSAGES.RESOLVE_REPORT_SUCCESS,
    result
  })
}
