import { UserRole, UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schema/users.schemas'

/**
 * Staff kế thừa User, mặc định role = Staff (2)
 * Dùng chung collection users, phân biệt bằng field role
 */
export default class Staff extends User {
  constructor(staff: {
    _id?: any
    name: string
    email: string

    password: string
    created_at?: Date
    updated_at?: Date
    verify?: UserVerifyStatus
    username?: string
    role?: UserRole
  }) {
    super({
      ...staff,
      gender: '',
      verify: staff.verify ?? UserVerifyStatus.Verified,
      username: staff.username || 'staff',
      role: staff.role ?? UserRole.Staff
    })
  }
}
