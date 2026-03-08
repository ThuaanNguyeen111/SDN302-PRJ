import { ObjectId } from 'mongodb'

export type ReportType = 'comment' | 'product' | 'order' | 'other'
export type ReportStatus = 'pending' | 'resolved' | 'rejected'

interface ReportSchemaType {
  _id?: ObjectId
  user_id: ObjectId
  type: ReportType // Loại report: bình luận, sản phẩm, đơn hàng, khác
  target_id?: string // ID của đối tượng bị report (comment_id, product_id, order_id...)
  reason: string // Lý do report
  description?: string // Mô tả chi tiết
  status?: ReportStatus
  resolved_by?: ObjectId | null // Staff xử lý
  resolved_note?: string // Ghi chú khi xử lý
  created_at?: Date
  updated_at?: Date
}

export default class Report {
  _id: ObjectId
  user_id: ObjectId
  type: ReportType
  target_id: string
  reason: string
  description: string
  status: ReportStatus
  resolved_by: ObjectId | null
  resolved_note: string
  created_at: Date
  updated_at: Date

  constructor(data: ReportSchemaType) {
    const now = new Date()
    this._id = data._id || new ObjectId()
    this.user_id = data.user_id
    this.type = data.type
    this.target_id = data.target_id || ''
    this.reason = data.reason
    this.description = data.description || ''
    this.status = data.status || 'pending'
    this.resolved_by = data.resolved_by || null
    this.resolved_note = data.resolved_note || ''
    this.created_at = data.created_at || now
    this.updated_at = data.updated_at || now
  }
}
