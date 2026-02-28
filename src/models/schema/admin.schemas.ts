import { ObjectId } from 'mongodb'
import { UserVerifyStatus, UserRole } from '~/constants/enums'

// Interface mô tả dữ liệu khởi tạo Admin
interface AdminType {
  _id?: ObjectId
  name: string
  email: string
  password: string

  created_at?: Date
  updated_at?: Date
  verify?: UserVerifyStatus
  username?: string
  role?: UserRole
}

// Lớp đại diện cho Admin
export default class Admin {
  _id?: ObjectId
  name: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
  verify: UserVerifyStatus
  username: string
  role: UserRole

  constructor(admin: AdminType) {
    const date = new Date()

    this._id = admin._id || new ObjectId()
    this.name = admin.name || ''
    this.email = admin.email
    this.password = admin.password

    this.created_at = admin.created_at || date
    this.updated_at = admin.updated_at || date
    this.verify = admin.verify || UserVerifyStatus.Verified
    this.username = admin.username || 'admin'
    this.role = admin.role || UserRole.Admin
  }
}
