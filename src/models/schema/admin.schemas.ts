import { UserVerifyStatus, UserRole } from '~/constants/enums'
import User from '~/models/schema/users.schemas'

/**
 * Admin kế thừa User, mặc định role = Admin (3)
 * Dùng chung collection users, phân biệt bằng field role
 */
export default class Admin extends User {
  constructor(admin: {
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
      ...admin,
      gender: '',
      verify: admin.verify ?? UserVerifyStatus.Verified,
      username: admin.username || 'admin',
      role: admin.role ?? UserRole.Admin
    })
  }
}
