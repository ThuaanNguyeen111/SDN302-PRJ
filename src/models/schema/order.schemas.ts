import { ObjectId } from 'mongodb'

interface OrderItem {
  product_id: ObjectId
  quantity: number
  price_at_purchase: number // Lưu giá gốc lúc mua
}

interface OrderType {
  _id?: ObjectId
  user_id: ObjectId
  items: OrderItem[]
  total_amount: number
  discount_amount: number
  final_amount: number
  address: string
  status?: string // Pending, Confirmed, Shipping, Delivered, Cancelled
  created_at?: Date
  updated_at?: Date
}

export default class Order {
  _id: ObjectId
  user_id: ObjectId
  items: OrderItem[]
  total_amount: number
  discount_amount: number
  final_amount: number
  address: string
  status: string
  created_at: Date
  updated_at: Date

  constructor(order: OrderType) {
    const now = new Date()
    this._id = order._id || new ObjectId()
    this.user_id = order.user_id
    this.items = order.items
    this.total_amount = order.total_amount
    this.discount_amount = order.discount_amount
    this.final_amount = order.final_amount
    this.address = order.address
    this.status = order.status || 'Pending'
    this.created_at = order.created_at || now
    this.updated_at = order.updated_at || now
  }
}
