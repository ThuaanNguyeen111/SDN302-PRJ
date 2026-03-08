import { ObjectId } from 'mongodb'

export type PointActionType = 'earn' | 'redeem'

interface PointHistoryType {
  _id?: ObjectId
  user_id: ObjectId
  action: PointActionType // 'earn' = cộng điểm, 'redeem' = trừ điểm đổi quà
  points: number // Số điểm thay đổi (luôn dương)
  description?: string // Mô tả lý do cộng/trừ
  reward_id?: ObjectId // Nếu action = 'redeem', lưu ID của reward
  created_at?: Date
}

export default class PointHistory {
  _id: ObjectId
  user_id: ObjectId
  action: PointActionType
  points: number
  description: string
  reward_id: ObjectId | null
  created_at: Date

  constructor(data: PointHistoryType) {
    this._id = data._id || new ObjectId()
    this.user_id = data.user_id
    this.action = data.action
    this.points = data.points
    this.description = data.description || ''
    this.reward_id = data.reward_id || null
    this.created_at = data.created_at || new Date()
  }
}
