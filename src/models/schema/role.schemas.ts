import { ObjectId } from 'mongodb'

/**
 * Bảng roles lưu trong MongoDB
 * Mỗi document đại diện cho 1 role trong hệ thống
 */

interface RoleType {
  _id?: ObjectId
  role_name: string // Guest | Member | Staff | Admin
  role_code: number // 0 | 1 | 2 | 3
  description?: string
  created_at?: Date
  updated_at?: Date
}

export default class Role {
  _id?: ObjectId
  role_name: string
  role_code: number
  description: string
  created_at: Date
  updated_at: Date

  constructor(role: RoleType) {
    const now = new Date()
    this._id = role._id || new ObjectId()
    this.role_name = role.role_name
    this.role_code = role.role_code
    this.description = role.description || ''
    this.created_at = role.created_at || now
    this.updated_at = role.updated_at || now
  }
}
