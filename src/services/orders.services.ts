import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'

import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/message'
import Order from '~/models/schema/order.schemas'
import PointHistory from '~/models/schema/pointHistory.schemas'
import { OrderStatus, UserRole } from '~/constants/enums'
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
      const voucher = await DatabaseService.vouchers.findOne({
        code: payload.voucher_code.toUpperCase(),
        status: 'active'
      })

      // Kiểm tra các điều kiện của voucher TRƯỚC KHI áp dụng
      if (!voucher || new Date() > new Date(voucher.end_date) || new Date() < new Date(voucher.start_date)) {
        throw new ErrorWithStatus({
          message: ORDER_MESSAGES.VOUCHER_NOT_FOUND_OR_EXPIRED,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      if (total_amount < voucher.min_order_value) {
        throw new ErrorWithStatus({ message: ORDER_MESSAGES.VOUCHER_NOT_ELIGIBLE, status: HTTP_STATUS.BAD_REQUEST })
      }
      if (voucher.used_count >= voucher.usage_limit) {
        throw new ErrorWithStatus({ message: 'Voucher đã hết lượt sử dụng', status: HTTP_STATUS.BAD_REQUEST })
      }

      // Giảm theo % hoặc số tiền tùy logic (Đã fix lỗi thiếu check percentage/amount)
      if (voucher.discount_type === 'percentage') {
        discount_amount = (total_amount * voucher.discount_value) / 100
      } else {
        discount_amount = voucher.discount_value
      }

      // CHỈ KHI hợp lệ hết mới tăng used_count lên 1
      DatabaseService.vouchers
        .updateOne({ _id: voucher._id }, { $inc: { used_count: 1 } })
        .catch((err) => console.error('Lỗi khi tăng used_count cho Voucher:', err))
    }

    const final_amount = Math.max(0, total_amount - discount_amount)

    // 3. Trừ tồn kho (Dùng $inc của Native Mongo Driver)
    for (const item of itemsToInsert) {
      await DatabaseService.products.updateOne(
        { _id: item.product_id },
        { $inc: { stock: -item.quantity, sold: item.quantity } }
      )
    }

    // 4. Khởi tạo class Schema và Insert đơn hàng
    const newOrder = new Order({
      user_id: new ObjectId(user_id),
      items: itemsToInsert,
      total_amount,
      discount_amount,
      final_amount,
      address: payload.address,
      status: OrderStatus.Pending
    })

    const result = await DatabaseService.orders.insertOne(newOrder)

    // =========================================================
    // 5. GỬI MAIL XÁC NHẬN ĐƠN HÀNG
    // =========================================================
    const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (user && user.email) {
      sendOrderConfirmationEmail(user.email, user.name, result.insertedId.toString(), final_amount).catch((error) => {
        console.error('Lỗi khi gửi email xác nhận đơn hàng:', error)
      })
    }

    // =========================================================
    // 6. TÍCH ĐIỂM: 100.000đ = 10 điểm (Tức là chia cho 10.000)
    // =========================================================
    // Đã đồng bộ mặc định 10000 để tránh lỗi toán học
    const pointsPerVnd = Number(process.env.POINTS_PER_VND) || 10000
    const earnedPoints = Math.floor(final_amount / pointsPerVnd)

    if (earnedPoints > 0) {
      DatabaseService.users
        .updateOne({ _id: new ObjectId(user_id) }, { $inc: { accumulated_points: earnedPoints } })
        .catch((err) => {
          console.error('Lỗi khi cập nhật accumulated_points cho User:', err)
        })
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
    const orders = await DatabaseService.orders.find({ user_id: new ObjectId(user_id) }).toArray()
    return orders
  }

  //!-------------------------------------------------------------------------------------------------|
  async updateOrderStatus(order_id: string, status: OrderStatus) {
    // 1. Lấy đơn hàng hiện tại ra trước để kiểm tra trạng thái cũ
    const order = await DatabaseService.orders.findOne({ _id: new ObjectId(order_id) })

    if (!order) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    // Nếu trạng thái không thay đổi thì không cần làm gì cả
    if (order.status === status) {
      return order
    }

    // 2. LOGIC KHI HỦY ĐƠN HÀNG (Chuyển sang Cancelled)
    if (status === OrderStatus.Cancelled && order.status !== OrderStatus.Cancelled) {
      // A. Tính toán lại số điểm cần thu hồi (Đã đồng bộ 10000 với hàm createOrder)
      const pointsPerVnd = Number(process.env.POINTS_PER_VND) || 10000
      const revokedPoints = Math.floor(order.final_amount / pointsPerVnd)

      if (revokedPoints > 0) {
        DatabaseService.users
          .updateOne({ _id: new ObjectId(order.user_id) }, { $inc: { accumulated_points: -revokedPoints } })
          .catch((err) => console.error('Lỗi khi thu hồi điểm:', err))

        const pointHistory = new PointHistory({
          user_id: new ObjectId(order.user_id),
          action: 'revoke',
          points: revokedPoints,
          description: `Thu hồi điểm do hủy đơn hàng #${order_id}`
        })
        DatabaseService.pointHistories
          .insertOne(pointHistory)
          .catch((err) => console.error('Lỗi khi ghi sao kê thu hồi:', err))
      }

      // B. HOÀN TRẢ LẠI TỒN KHO CHO SẢN PHẨM
      for (const item of order.items) {
        DatabaseService.products
          .updateOne({ _id: new ObjectId(item.product_id) }, { $inc: { stock: item.quantity, sold: -item.quantity } })
          .catch((err) => console.error('Lỗi khi hoàn trả tồn kho:', err))
      }
    }

    // 3. Cập nhật trạng thái mới vào Database
    const result = await DatabaseService.orders.findOneAndUpdate(
      { _id: new ObjectId(order_id) },
      { $set: { status, updated_at: new Date() } },
      { returnDocument: 'after' }
    )

    return result
  }
  //!-------------------------------------------------------------------------------------------------|
  async getOrderById(order_id: string, user_id: string, role: number) {
    const order = await DatabaseService.orders.findOne({ _id: new ObjectId(order_id) })

    if (!order) {
      throw new ErrorWithStatus({ message: ORDER_MESSAGES.ORDER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    if (role === UserRole.Member && order.user_id.toString() !== user_id) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xem đơn hàng của người khác',
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    return order
  }

  //!-------------------------------------------------------------------------------------------------|
  async getAllOrdersForAdmin() {
    const orders = await DatabaseService.orders.find().sort({ created_at: -1 }).toArray()
    return orders
  }
}

const OrderServices = new OrderService()
export default OrderServices
