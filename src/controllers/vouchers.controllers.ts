import { Request, Response } from 'express'
import { VOUCHER_MESSAGES } from '~/constants/message'
import VoucherServices from '~/services/vouchers.services'

export const createVoucherController = async (req: Request, res: Response) => {
  const result = await VoucherServices.createVoucher(req.body)
  return res.json({
    message: VOUCHER_MESSAGES.CREATE_VOUCHER_SUCCESS,
    result
  })
}

export const getAllVouchersController = async (req: Request, res: Response) => {
  const result = await VoucherServices.getAllVouchers()
  return res.json({
    message: VOUCHER_MESSAGES.GET_VOUCHERS_SUCCESS,
    result
  })
}

export const checkVoucherController = async (req: Request, res: Response) => {
  const { code, total_amount } = req.body
  const result = await VoucherServices.checkVoucher(code, total_amount)

  return res.json({
    message: VOUCHER_MESSAGES.CHECK_VOUCHER_SUCCESS,
    result
  })
}
