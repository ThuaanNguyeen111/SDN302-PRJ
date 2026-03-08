import { ObjectId } from 'mongodb'

interface RewardType {
  _id?: ObjectId
  name: string
  description?: string
  image?: string
  points_required: number // Số điểm cần để đổi
  stock: number // Số lượng quà còn lại
  status?: 'active' | 'inactive'
  created_at?: Date
  updated_at?: Date
}

export default class Reward {
  _id: ObjectId
  name: string
  description: string
  image: string
  points_required: number
  stock: number
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date

  constructor(reward: RewardType) {
    const now = new Date()
    this._id = reward._id || new ObjectId()
    this.name = reward.name
    this.description = reward.description || ''
    this.image = reward.image || ''
    this.points_required = reward.points_required
    this.stock = reward.stock || 0
    this.status = reward.status || 'active'
    this.created_at = reward.created_at || now
    this.updated_at = reward.updated_at || now
  }
}
