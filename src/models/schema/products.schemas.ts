import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  price: number
  stock: number
  description?: string
  image?: string
  rating?: number // Điểm đánh giá trung bình
  sold?: number // Số lượng đã bán để thống kê
  allow_preorder?: boolean // Cho phép đặt trước hay không
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id: ObjectId
  name: string
  price: number
  stock: number
  description: string
  image: string
  rating: number
  sold: number
  allow_preorder: boolean
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const now = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.price = product.price
    this.stock = product.stock || 0
    this.description = product.description || ''
    this.image = product.image || ''
    this.rating = product.rating || 0
    this.sold = product.sold || 0
    this.allow_preorder = product.allow_preorder || false
    this.created_at = product.created_at || now
    this.updated_at = product.updated_at || now
  }
}
