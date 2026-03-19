import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Cart from '~/models/schema/cart.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class CartService {
  //! 1. THÊM SẢN PHẨM VÀO GIỎ HÀNG
  async addToCart(user_id: string, payload: { product_id: string; quantity: number }) {
    const userObjId = new ObjectId(user_id)
    const productObjId = new ObjectId(payload.product_id)

    // Kiểm tra kho hàng xem có đủ hàng không
    const product = await DatabaseService.products.findOne({ _id: productObjId })
    if (!product) throw new ErrorWithStatus({ message: 'Không tìm thấy sản phẩm', status: HTTP_STATUS.NOT_FOUND })
    if (product.stock < payload.quantity)
      throw new ErrorWithStatus({ message: 'Sản phẩm không đủ số lượng', status: HTTP_STATUS.BAD_REQUEST })

    const cart = await DatabaseService.carts.findOne({ user_id: userObjId })

    if (!cart) {
      // Nếu chưa có giỏ hàng -> Tạo mới
      const newCart = new Cart({
        user_id: userObjId,
        items: [{ product_id: productObjId, quantity: payload.quantity }]
      })
      await DatabaseService.carts.insertOne(newCart)
      return newCart
    }

    // Nếu đã có giỏ hàng -> Kiểm tra sản phẩm đã có trong giỏ chưa
    const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === payload.product_id)

    if (itemIndex > -1) {
      // Đã có -> Cộng dồn số lượng
      cart.items[itemIndex].quantity += payload.quantity
    } else {
      // Chưa có -> Push vào mảng items
      cart.items.push({ product_id: productObjId, quantity: payload.quantity })
    }

    await DatabaseService.carts.updateOne(
      { user_id: userObjId },
      { $set: { items: cart.items, updated_at: new Date() } }
    )

    return await DatabaseService.carts.findOne({ user_id: userObjId })
  }
  //!=-------------------------------------------------------------------------------------------------|

  //! 2. LẤY GIỎ HÀNG CỦA USER (Kèm thông tin sản phẩm)
  async getCart(user_id: string) {
    const cart = await DatabaseService.carts
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: process.env.DB_PRODUCTS_COLLECTION || 'products',
            localField: 'items.product_id',
            foreignField: '_id',
            as: 'product_info'
          }
        },
        { $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            user_id: { $first: '$user_id' },
            created_at: { $first: '$created_at' },
            updated_at: { $first: '$updated_at' },
            items: {
              $push: {
                product_id: '$items.product_id',
                quantity: '$items.quantity',
                product_name: '$product_info.name',
                price: '$product_info.price',
                image: '$product_info.image',
                stock: '$product_info.stock'
              }
            }
          }
        }
      ])
      .toArray()

    return cart.length > 0 ? cart[0] : { user_id, items: [] }
  }
  //!=-------------------------------------------------------------------------------------------------|

  //! 3. XÓA 1 SẢN PHẨM KHỎI GIỎ HÀNG
  async removeCartItem(user_id: string, product_id: string) {
    const userObjId = new ObjectId(user_id)
    const productObjId = new ObjectId(product_id)

    const result = await DatabaseService.carts.findOneAndUpdate(
      {
        user_id: userObjId,
        'items.product_id': productObjId // <-- Bắt buộc giỏ hàng phải đang chứa món này thì mới tìm thấy
      },
      { $pull: { items: { product_id: productObjId } } as any },
      { returnDocument: 'after' }
    )

    // Nếu result = null thì là món hàng không có trong giỏ
    if (!result) {
      throw new ErrorWithStatus({
        message: 'Sản phẩm này đã bị xóa hoặc không tồn tại trong giỏ hàng',
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }
  //!=-------------------------------------------------------------------------------------------------|
  //! 4. CẬP NHẬT SỐ LƯỢNG MỘT MÓN TRONG GIỎ (+ / -)
  async updateCartQuantity(user_id: string, payload: { product_id: string; quantity: number }) {
    const userObjId = new ObjectId(user_id)
    const productObjId = new ObjectId(payload.product_id)

    // Nếu Frontend gửi số lượng <= 0, tự động vứt món đó ra khỏi giỏ
    if (payload.quantity <= 0) {
      return await this.removeCartItem(user_id, payload.product_id)
    }

    // Nếu > 0 thì cập nhật đúng con số đó
    const result = await DatabaseService.carts.findOneAndUpdate(
      { user_id: userObjId, 'items.product_id': productObjId },
      { $set: { 'items.$.quantity': payload.quantity, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) throw new ErrorWithStatus({ message: 'Sản phẩm không có trong giỏ', status: 404 })
    return result
  }
}

export default new CartService()
