import { ObjectId } from 'mongodb'

interface VoucherType {
  _id?: ObjectId
  code: string // Ví dụ: GIAM50K, FREESHIP
  discount_type: 'amount' | 'percentage' // Loại giảm: theo số tiền hoặc %
  discount_value: number // Số tiền hoặc số %
  min_order_value: number // Đơn tối thiểu để áp dụng
  start_date: Date
  end_date: Date
  usage_limit: number // Tổng số lượt dùng tối đa
  used_count?: number // Số lượt đã dùng
  status?: 'active' | 'inactive'
  created_at?: Date
  updated_at?: Date
}

export default class Voucher {
  _id: ObjectId
  code: string
  discount_type: 'amount' | 'percentage'
  discount_value: number
  min_order_value: number
  start_date: Date
  end_date: Date
  usage_limit: number
  used_count: number
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date

  constructor(voucher: VoucherType) {
    const now = new Date()
    this._id = voucher._id || new ObjectId()
    this.code = voucher.code.toUpperCase()
    this.discount_type = voucher.discount_type
    this.discount_value = voucher.discount_value
    this.min_order_value = voucher.min_order_value || 0
    this.start_date = voucher.start_date
    this.end_date = voucher.end_date
    this.usage_limit = voucher.usage_limit || 1
    this.used_count = voucher.used_count || 0
    this.status = voucher.status || 'active'
    this.created_at = voucher.created_at || now
    this.updated_at = voucher.updated_at || now
  }
}
