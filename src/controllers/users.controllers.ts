console.log(' LoginController already run')
import { Request, Response } from 'express'
import { USERS_MESSAGES } from '~/constants/message'
import {
  EmailVerifyReqBody,
  ForgotPasswordReqBody,
  getInforByCitizenIDReqBody,
  LoginReqBody,
  LogoutResBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateMeReqBody
} from '~/models/request/user.requests'
import { ParamsDictionary } from 'express-serve-static-core' //này copilot ko tự xổ dùng chatgpt
import UserServicess from '~/services/users.servicec'
import User from '~/models/schema/users.schemas'
import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import { getRedirectPathByRole } from '~/utils/auth.utils'
import DatabaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { sendVerificationEmail } from '~/utils/mailer'

//!------------------------------------------------------------------------------------------------|
export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //? lấy user_id từ user của req
  console.log('User login:', req.user._id)
  const user = req.user as User
  const user_id = user._id as ObjectId //! lấy từ mongo về nên nó sẽ là object id

  //* dùng user_id để tạo access_token và refresh_token
  const result = await UserServicess.login({
    user_id: user_id.toString(),
    verify: user.verify
  })
  console.log('Redirect path:', getRedirectPathByRole(result.role as UserRole))
  const redirectTo = getRedirectPathByRole(result.role as UserRole) // lấy đường dẫn redirect dựa vào role của user

  //sau khi lấy được res về access_token vàrefresh_token thì gửi về cho client
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result,
    redirectTo // kèm thêm hướng dẫn front-end nên đi đâu
  })
}
//!------------------------------------------------------------------------------------------------|

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  //TODO --- Tạo 1 user mới và bỏ vào collection users trong database
  const result = await UserServicess.register(req.body)

  return res.json({ result })
}
//!------------------------------------------------------------------------------------------------|

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutResBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await UserServicess.logout(refresh_token)
  res.json(result)
}

//!------------------------------------------------------------------------------------------------|

export const emailVerifyController = async (req: Request<ParamsDictionary, any, EmailVerifyReqBody>, res: Response) => {
  //* khi mà req vào được đây nghĩa là emai_verify_token đã valid
  // đồng thời trong req sẽ có decoded.email_verify_token
  const { user_id } = req.decode_email_verify_token as TokenPayload

  const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.NOT_FOUND
    })
  }

  //? NẾU CÓ USER ĐÓ THÌ MÌNH SẼ KIỂM TRA XEM USER ĐÓ ĐÃ LƯU EMAIL_VERIFY_TOKEN ĐÓ CHƯA
  //* nếu mà tìm được rồi thì nó sẽ rỗng
  if (user.email_verify_token === '') {
    // Nếu đã verify rồi thì redirect về trang chủ kèm thông báo
    return res.redirect('http://localhost:3000/login')
  }

  // Nếu xuống được đây nghĩa là user này là có nhưng chưa verify
  //? verify email là : tìm user đó và update lại email_verify_token thành rỗng
  //? và verify thành true | 1
  await UserServicess.verifyEmail(user_id)

  // Sau khi verify thành công thì redirect về trang chủ kèm thông báo
  return res.redirect('http://localhost:3000/login')
}

//!--------------------------------------------------------------------------------------------------------------------------|
export const resendEmailVerifyController = async (req: Request, res: Response) => {
  // Lấy email từ req.body
  const { email } = req.body

  // Nếu không có email thì trả lỗi
  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.EMAIL_IS_REQUIRED
    })
  }

  // Tìm user có email đó
  const user = await DatabaseService.users.findOne({ email })

  // Nếu không tìm thấy user thì trả lỗi
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.NOT_FOUND
    })
  }

  // Nếu user đã verify thì trả về thông báo
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }

  // Nếu user chưa verify thì tiến hành tạo mới email_verify_token và lưu vào database
  const email_verify_token = await UserServicess.resendEmailVerify(user._id.toString())

  // Gửi lại email xác thực cho user
  await sendVerificationEmail(user.email, user.name, email_verify_token)

  // Trả về thông báo gửi thành công
  return res.json({
    message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_TOKEN_SUCCESS
  })
}

//!--------------------------------------------------------------------------------------------------------------------------|

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  //* vì đã qua được forgotPasswordValidator nên req sẽ có user
  const { _id, verify } = req.user as User
  //? tiến hành tạo forgot_password_token và lưu vào user đó kèm gửi mail cho user
  const result = await UserServicess.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json({ result })
}

//!--------------------------------------------------------------------------------------------------------------------------|
export const forgotPasswordverifyForgotPasswordController = async (req: Request, res: Response) => {
  res.json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS })
}
//!--------------------------------------------------------------------------------------------------------------------------|
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  //* Muốn đổi mk thì cần user_id và new_password
  const { user_id } = req.decode_forgot_password_token as TokenPayload
  const { password } = req.body
  //cập nhật cho database
  const result = await UserServicess.resetPassword({ user_id, password })
  return res.json(result)
}
//!--------------------------------------------------------------------------------------------------------------------------|
//! ĐỌC LẠI
export const getMeController = async (req: Request, res: Response) => {
  //Muốn lấy profile thì cần access_token co user_id trong đó
  const { user_id } = req.decode_authorization as TokenPayload
  //tìm user có user_id đó
  const user = await UserServicess.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}
//!--------------------------------------------------------------------------------------------------------------------------|
//! ĐỌC LẠI
export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  // muốn update cần user_id, và các thông tin cần update
  const { user_id } = req.decode_authorization as TokenPayload
  //khi muốn update thì nó sẽ gửi tất cả trong body
  const { body } = req
  //update lại user
  const result = await UserServicess.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const getCitizenIDController = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const result = await UserServicess.getCitizenID(user_id)
  return res.json(result)
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const getUserInforBYCitizenIController = async (
  req: Request<ParamsDictionary, any, getInforByCitizenIDReqBody>,
  res: Response
) => {
  const { citizen_id } = req.body
  const result = await UserServicess.getUserInforBYCitizenID(citizen_id)
  return res.json(result)
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const refreshAccessTokenController = async (req: Request, res: Response) => {
  const { decode_refresh_token } = req as Request & {
    decode_refresh_token: { user_id: string }
  }

  // Nếu không có user_id thì trả lỗi
  if (!decode_refresh_token?.user_id) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    })
  }

  // Tạo lại access token
  const result = await UserServicess.createAccessTokenFromRefresh(decode_refresh_token.user_id)

  return res.json({
    message: 'Access token refreshed successfully',
    result
  })
}
