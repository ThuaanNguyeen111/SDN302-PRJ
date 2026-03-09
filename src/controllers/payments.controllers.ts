import { Request, Response } from 'express'
import paymentService from '~/services/payments.services'

export const createMoMoPaymentController = async (req: Request, res: Response) => {
  const { order_id, amount } = req.body // Nhận từ Frontend gửi lên

  const result = await paymentService.createMoMoPaymentUrl(order_id, Number(amount))

  return res.json({
    message: 'Create payment URL successfully',
    result // Sẽ chứa { payUrl: 'https://test-payment.momo.vn/...' }
  })
}
