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

interface UserType {
  _id?: ObjectId
  name?: string
  gender: string
  email: string
  citizen_id?: string
  date_of_birth?: Date
  password: string
  phone_number?: string
  blood_type?: string
  address?: Address

  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  role: UserRole
  location?: string
  username?: string

  // new fields
  last_donation_date?: Date | null
}

export default class User {
  _id?: ObjectId
  name: string
  gender: string
  email: string
  citizen_id: string
  date_of_birth: Date
  password: string
  phone_number: string
  blood_type: string
  address: Address

  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  role: UserRole
  location: string
  username: string

  // new fields
  last_donation_date: Date | null

  constructor(user: UserType) {
    const now = new Date()
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.gender = user.gender || ''
    this.email = user.email
    this.citizen_id = user.citizen_id || ''
    this.date_of_birth = user.date_of_birth || now
    this.password = user.password
    this.phone_number = user.phone_number || ''
    this.blood_type = user.blood_type || ''
    this.address =
      user.address || ({ street: '', ward: '', district: '', city: '', country: '', zipcode: '' } as Address)

    this.created_at = user.created_at || now
    this.updated_at = user.updated_at || now
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.role = user.role || UserRole.User
    this.location = user.location || ''
    this.username = user.username || ''

    // new fields
    this.last_donation_date = user.last_donation_date ?? null
  }
}
