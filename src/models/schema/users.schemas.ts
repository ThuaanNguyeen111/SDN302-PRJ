import { ObjectId } from 'mongodb'

import { UserRole, UserVerifyStatus } from '~/constants/enums'

interface Address {
  street: string
  ward: string
  district: string
  city: string
  country: string
  zipcode?: string
}

/**
 * Schema thống nhất cho tất cả user trong hệ thống
 * Phân biệt quyền bằng field `role` (khớp với role_code trong bảng roles)
 *   Guest = 0 | Member = 1 | Staff = 2 | Admin = 3
 */
interface UserType {
  _id?: ObjectId
  name?: string
  gender?: string
  email: string

  date_of_birth?: Date
  password: string
  phone_number?: string

  address?: Address
  accumulated_points?: number
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  role?: UserRole // khớp với role_code trong collection roles
  location?: string
  username?: string
  avatar?: string

  // Member-specific
  last_donation_date?: Date | null
}

export default class User {
  _id?: ObjectId
  name: string
  gender: string
  email: string

  date_of_birth: Date
  password: string
  phone_number: string

  address: Address
  accumulated_points: number
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  role: UserRole
  location: string
  username: string
  avatar: string

  constructor(user: UserType) {
    const now = new Date()
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.gender = user.gender || ''
    this.email = user.email

    this.date_of_birth = user.date_of_birth || now
    this.password = user.password
    this.phone_number = user.phone_number || ''
    this.address =
      user.address || ({ street: '', ward: '', district: '', city: '', country: '', zipcode: '' } as Address)

    // SỬA Ở ĐÂY 1: Khởi tạo giá trị mặc định cho accumulated_points là 0
    this.accumulated_points = user.accumulated_points || 0

    // SỬA Ở ĐÂY 2: Xóa chữ "this." bị dư
    this.created_at = user.created_at || now
    this.updated_at = user.updated_at || now
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.role = user.role ?? UserRole.Member
    this.location = user.location || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
  }
}
