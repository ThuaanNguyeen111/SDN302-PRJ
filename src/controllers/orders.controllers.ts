import { Request, Response } from 'express'
import { ORDER_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/request/user.requests'
import OrderServices from '~/services/orders.services'

export const createOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await OrderServices.createOrder(user_id, req.body)

  return res.json({
    message: ORDER_MESSAGES.ORDER_SUCCESS,
    result
  })
}

export const getMyOrdersController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await OrderServices.getMyOrders(user_id)

  return res.json({
    message: ORDER_MESSAGES.GET_ORDER_SUCCESS,
    result
  })
}

export const updateOrderStatusController = async (req: Request, res: Response) => {
  const { order_id } = req.params
  const { status } = req.body
  const result = await OrderServices.updateOrderStatus(order_id, status)

  return res.json({
    message: ORDER_MESSAGES.UPDATE_STATUS_SUCCESS,
    result
  })
}
export const cancelOrderController = async (req: Request, res: Response) => {
  const { order_id } = req.params
  const { user_id } = req.decode_authorization as TokenPayload

  const result = await OrderServices.cancelOrder(order_id, user_id)

  return res.json({
    message: 'Hủy đơn hàng thành công',
    result
  })
}

export const getOrderByIdController = async (req: Request, res: Response) => {
  const { order_id } = req.params
  const { user_id, role } = req.decode_authorization as TokenPayload

  const result = await OrderServices.getOrderById(order_id, user_id, role)

  return res.json({
    message: ORDER_MESSAGES.GET_ORDER_SUCCESS,
    result
  })
}

export const getAllOrdersController = async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersForAdmin()

  return res.json({
    message: ORDER_MESSAGES.GET_ORDER_SUCCESS,
    result
  })
}
