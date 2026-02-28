import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'

export interface getInforByCitizenIDReqBody {
  citizen_id: string
}
export interface Address {
  street: string
  ward: string
  district: string
  city: string
  country: string
  zipcode?: string
}

export interface RegisterReqBody {
  name: string
  gender: string
  email: string
  citizen_id: string
  password: string
  confirmPassword: string
  phone_number: string
  Address: Address // địa chỉ là  gồm các trường street, ward, district, city, country, zipcode
  date_of_birth: string

}

//!------------------------------------------------------------------------------------------------
export interface LoginReqBody {
  email: string
  password: string
}
//!------------------------------------------------------------------------------------------------
export interface LogoutResBody {
  refresh_token: string
}
//!------------------------------------------------------------------------------------------------
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
  verify: UserVerifyStatus
  // add role and hospital_id if needed
  hospital_id?: string
  exp: number
  iat: number
}
//!------------------------------------------------------------------------------------------------
export interface EmailVerifyReqBody {
  email_verify_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}
export interface VerifyForgotPasswordTokenReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_assword: string
}
interface address {
  street?: string
  ward?: string
  district?: string
  city?: string
  country?: string
  zipcode?: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string //vì ngta truyền lên string dạng ISO8601, k phải date
  gender?: string
  citizen_id?: string
  address?: address

  avatar?: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}
