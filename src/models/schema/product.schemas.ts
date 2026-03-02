import { ObjectId } from 'mongodb'

interface ProductType {
  _id?: ObjectId
  name: string
  description?: string
  category?: string
  price: number
  stock_quantity: number
  image_url?: string
  brand?: string
  age_range?: string // e.g., "0-6 months", "6-12 months", "1-3 years"
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id: ObjectId
  name: string
  description: string
  category: string
  price: number
  stock_quantity: number
  image_url: string
  brand: string
  age_range: string
  created_at: Date
  updated_at: Date

  constructor(product: ProductType) {
    const now = new Date()
    this._id = product._id || new ObjectId()
    this.name = product.name
    this.description = product.description || ''
    this.category = product.category || ''
    this.price = product.price
    this.stock_quantity = product.stock_quantity ?? 0
    this.image_url = product.image_url || ''
    this.brand = product.brand || ''
    this.age_range = product.age_range || ''
    this.created_at = product.created_at || now
    this.updated_at = product.updated_at || now
  }
}
