import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Report from '~/models/schema/report.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { REPORT_MESSAGES } from '~/constants/message'

class ReportService {
  //!-------------------------------------------------------------------------------------------------|
  // 1. GỬI REPORT (Member)
  async createReport(user_id: string, payload: any) {
    const newReport = new Report({
      user_id: new ObjectId(user_id),
      type: payload.type,
      target_id: payload.target_id,
      reason: payload.reason,
      description: payload.description
    })

    await DatabaseService.reports.insertOne(newReport)
    return { ...newReport }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 2. XEM DANH SÁCH REPORT ĐANG CHỜ (Staff)
  async getPendingReports() {
    const reports = await DatabaseService.reports
      .aggregate([
        { $match: { status: 'pending' } },
        {
          $lookup: {
            from: process.env.DB_USERS_COLLECTION || 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'reporter'
          }
        },
        { $unwind: { path: '$reporter', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            'reporter.password': 0,
            'reporter.email_verify_token': 0,
            'reporter.forgot_password_token': 0
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()

    return reports
  }

  //!-------------------------------------------------------------------------------------------------|
  // 3. ĐÁNH DẤU REPORT ĐÃ GIẢI QUYẾT (Staff)
  async resolveReport(
    report_id: string,
    staff_id: string,
    payload: { status: 'resolved' | 'rejected'; resolved_note?: string }
  ) {
    const report = await DatabaseService.reports.findOne({ _id: new ObjectId(report_id) })

    if (!report) {
      throw new ErrorWithStatus({
        message: REPORT_MESSAGES.REPORT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (report.status !== 'pending') {
      throw new ErrorWithStatus({
        message: REPORT_MESSAGES.REPORT_ALREADY_RESOLVED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await DatabaseService.reports.findOneAndUpdate(
      { _id: new ObjectId(report_id) },
      {
        $set: {
          status: payload.status,
          resolved_by: new ObjectId(staff_id),
          resolved_note: payload.resolved_note || '',
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    return result
  }
}

const ReportServices = new ReportService()
export default ReportServices
