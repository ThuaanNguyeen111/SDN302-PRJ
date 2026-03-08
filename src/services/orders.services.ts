import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'

import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/message'
import Order from '~/models/schema/order.schemas'
import PointHistory from '~/models/schema/pointHistory.schemas'
import { UserRole } from '~/constants/enums'
import { sendOrderConfirmationEmail } from '~/utils/order-mailer'

class OrderService {
  //!-------------------------------------------------------------------------------------------------|
  async createOrder(user_id: string, payload: any) {
    let total_amount = 0
    const itemsToInsert = []

    // 1. Tính toán giá tiền từ bảng Products (Tránh user fake giá từ frontend)
    for (const item of payload.items) {
      const product = await DatabaseService.products.findOne({ _id: new ObjectId(item.product_id) })

      if (!product) {
        throw new ErrorWithStatus({ message: ORDER_MESSAGES.PRODUCT_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
      }
      if (product.stock < item.quantity && !product.allow_preorder) {
        throw new ErrorWithStatus({ message: ORDER_MESSAGES.NOT_ENOUGH_STOCK, status: HTTP_STATUS.BAD_REQUEST })
      }

      total_amount += (product.price || 0) * item.quantity
      itemsToInsert.push({
        product_id: product._id,
        quantity: item.quantity,
        price_at_purchase: product.price || 0
      })
    }

    // 2. Logic tính Voucher (Nếu có truyền voucher_code)
    let discount_amount = 0
    if (payload.voucher_code) {
      const voucher = await DatabaseService.vouchers.findOne({ code: payload.voucher_code, status: 'active' })

      if (!voucher || new Date() > new Date(voucher.end_date)) {
        throw new ErrorWithStatus({
          message: ORDER_MESSAGES.VOUCHER_NOT_FOUND_OR_EXPIRED,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      if (total_amount < voucher.min_order_value) {
        throw new ErrorWithStatus({ message: ORDER_MESSAGES.VOUCHER_NOT_ELIGIBLE, status: HTTP_STATUS.BAD_REQUEST })
      }

      // Giảm theo % hoặc số tiền tùy logic của bạn (Ở đây ví dụ trừ tiền thẳng)
      discount_amount = voucher.discount_value
    }

    const final_amount = Math.max(0, total_amount - discount_amount)

    // 3. Trừ tồn kho (Dùng $inc của Native Mongo Driver)
    for (const item of itemsToInsert) {
      await DatabaseService.products.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      )
    }

    // 4. Khởi tạo class Schema và Insert
    const newOrder = new Order({
      user_id: new ObjectId(user_id),
      items: itemsToInsert,
      total_amount,
      discount_amount,
      final_amount,
      address: payload.address
    })

    const result = await DatabaseService.orders.insertOne(newOrder)

    // =========================================================
    // 5. GỬI MAIL XÁC NHẬN ĐƠN HÀNG
    // =========================================================
    // Tìm thông tin user để lấy email và tên
    const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (user && user.email) {
      // Gọi hàm gửi mail nhưng KHÔNG dùng 'await'
      // Việc này giúp API kết thúc sớm và trả response về FE ngay lập tức
      // Dùng .catch() để log lỗi nếu gửi mail thất bại, không làm gián đoạn luồng code
      sendOrderConfirmationEmail(user.email, user.name, result.insertedId.toString(), final_amount).catch((error) => {
        console.error('Lỗi khi gửi email xác nhận đơn hàng:', error)
      })
    }
    // =========================================================

    // 6. TÍCH ĐIỂM: cứ mỗi POINTS_PER_VND đồng được 1 điểm
    const pointsPerVnd = Number(process.env.POINTS_PER_VND) || 1000
    const earnedPoints = Math.floor(final_amount / pointsPerVnd)
    if (earnedPoints > 0) {
      const pointHistory = new PointHistory({
        user_id: new ObjectId(user_id),
        action: 'earn',
        points: earnedPoints,
        description: `Tích điểm đơn hàng #${result.insertedId} (${final_amount.toLocaleString()}đ)`
      })
      DatabaseService.pointHistories.insertOne(pointHistory).catch((err) => {
        console.error('Lỗi khi tích điểm:', err)
      })
    }

    return { order_id: result.insertedId, points_earned: earnedPoints, ...newOrder }
  }

  //!-------------------------------------------------------------------------------------------------|
  async getMyOrders(user_id: string) {
    // Dùng .toArray() vì find() trả về cursor trong Native MongoDB
    const orders = await DatabaseService.orders.find({ user_id: new ObjectId(user_id) }).toArray()
    return orders
  }

  //!-------------------------------------------------------------------------------------------------|
  async updateOrderStatus(order_id: string, status: string) {
    const result = await DatabaseService.orders.findOneAndUpdate(
      { _id: new ObjectId(order_id) },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' } // Trả về document sau khi update
    )

    if (!result) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    return result
  }
  //!-------------------------------------------------------------------------------------------------|
  // XEM CHI TIẾT 1 ĐƠN HÀNG (GET /orders/:id)
  async getOrderById(order_id: string, user_id: string, role: number) {
    const order = await DatabaseService.orders.findOne({ _id: new ObjectId(order_id) })

    if (!order) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    // BẢO MẬT: Nếu là User thường (role === 0), chỉ được phép xem đơn hàng của chính mình tạo ra
    if (role === UserRole.Member && order.user_id.toString() !== user_id) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xem đơn hàng của người khác',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    return order
  }

  //!-------------------------------------------------------------------------------------------------|
  // DANH SÁCH TẤT CẢ ĐƠN HÀNG CHO ADMIN/STAFF (GET /admin/orders)
  async getAllOrdersForAdmin() {
    // Sắp xếp theo created_at giảm dần (-1) để đơn mới nhất lên đầu
    const orders = await DatabaseService.orders.find().sort({ created_at: -1 }).toArray()
    return orders
  }
}

const OrderServices = new OrderService()
export default OrderServices
