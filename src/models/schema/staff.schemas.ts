import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enums'

interface StaffType {
  _id?: ObjectId
  name: string
  email: string
  citizen_id?: string
  password: string
  created_at?: Date
  updated_at?: Date
  verify?: UserVerifyStatus
  username?: string
  role?: UserRole
}

export default class Staff {
  _id?: ObjectId
  name: string
  email: string
  citizen_id: string
  password: string
  created_at: Date
  updated_at: Date
  verify: UserVerifyStatus
  username: string
  role: UserRole

  constructor(staff: StaffType) {
    const date = new Date()
    this._id = staff._id || new ObjectId()
    this.name = staff.name
    this.email = staff.email
    this.citizen_id = staff.citizen_id || ''
    this.password = staff.password
    this.created_at = staff.created_at || date
    this.updated_at = staff.updated_at || date
    this.verify = staff.verify || UserVerifyStatus.Verified
    this.username = staff.username || 'staff'
    this.role = staff.role || UserRole.Staff
  }
}
