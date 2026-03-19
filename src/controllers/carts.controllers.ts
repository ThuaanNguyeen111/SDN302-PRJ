import { Request, Response } from 'express'
import cartService from '~/services/carts.services'
import { TokenPayload } from '~/models/request/user.requests'

export const addToCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await cartService.addToCart(user_id, req.body)
  return res.json({ message: 'Thêm vào giỏ hàng thành công', result })
}

export const getCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await cartService.getCart(user_id)
  return res.json({ message: 'Lấy giỏ hàng thành công', result })
}
export const removeCartItemController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { product_id } = req.params
  const result = await cartService.removeCartItem(user_id, product_id)
  return res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng', result })
}
export const updateCartQuantityController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await cartService.updateCartQuantity(user_id, req.body)
  return res.json({ message: 'Cập nhật số lượng thành công', result })
}
