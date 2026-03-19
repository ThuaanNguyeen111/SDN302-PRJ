import DatabaseService from './database.services'
import Voucher from '~/models/schema/vouchers.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { VOUCHER_MESSAGES } from '~/constants/message'

class VoucherService {
  //!-------------------------------------------------------------------------------------------------|
  // 1. TẠO VOUCHER (Dành cho Staff/Admin)
  async createVoucher(payload: any) {
    // Kiểm tra xem mã này đã tồn tại chưa
    const isExist = await DatabaseService.vouchers.findOne({ code: payload.code.toUpperCase() })
    if (isExist) {
      throw new ErrorWithStatus({
        message: VOUCHER_MESSAGES.VOUCHER_CODE_ALREADY_EXISTS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newVoucher = new Voucher({
      ...payload,
      start_date: new Date(payload.start_date),
      end_date: new Date(payload.end_date)
    })

    const result = await DatabaseService.vouchers.insertOne(newVoucher)
    return { ...newVoucher }
  }

  //!-------------------------------------------------------------------------------------------------|
  // 2. LẤY DANH SÁCH VOUCHER (Dành cho Staff/Admin)
  async getAllVouchers() {
    const vouchers = await DatabaseService.vouchers.find().sort({ created_at: -1 }).toArray()
    return vouchers
  }

  //!-------------------------------------------------------------------------------------------------|
  // 3. KIỂM TRA VOUCHER (Dành cho Front-end tính tiền tạm)
  async checkVoucher(code: string, total_amount: number) {
    const voucher = await DatabaseService.vouchers.findOne({ code: code.toUpperCase() })

    // Các bước kiểm tra nghiệp vụ (Validate Business Rules)
    if (!voucher || voucher.status === 'inactive') {
      throw new ErrorWithStatus({
        message: VOUCHER_MESSAGES.VOUCHER_NOT_FOUND_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const now = new Date()
    if (now < voucher.start_date || now > voucher.end_date) {
      throw new ErrorWithStatus({
        message: VOUCHER_MESSAGES.VOUCHER_NOT_FOUND_OR_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (voucher.used_count >= voucher.usage_limit) {
      throw new ErrorWithStatus({
        message: VOUCHER_MESSAGES.VOUCHER_USAGE_LIMIT_REACHED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (total_amount < voucher.min_order_value) {
      throw new ErrorWithStatus({ message: VOUCHER_MESSAGES.VOUCHER_NOT_ELIGIBLE, status: HTTP_STATUS.BAD_REQUEST })
    }

    // Tính toán số tiền được giảm
    let discount_amount = 0
    if (voucher.discount_type === 'percentage') {
      discount_amount = (total_amount * voucher.discount_value) / 100
    } else {
      discount_amount = voucher.discount_value
    }

    const final_amount = Math.max(0, total_amount - discount_amount)

    return {
      discount_amount,
      final_amount,
      voucher_code: voucher.code
    }
  }
}

const VoucherServices = new VoucherService()
export default VoucherServices
