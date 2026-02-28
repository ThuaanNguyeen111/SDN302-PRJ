import DatabaseService from './database.services'
import { hashPassword } from '~/utils/crypto'
import { TokenTypes, UserRole, UserVerifyStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'

import RefreshToken from '~/models/schema/refreshToken.schemas'
import User from '~/models/schema/users.schemas'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/request/user.requests'
import { findUserById } from '~/utils/findUserById'
import nodemailer from 'nodemailer'
import { getRedirectPathByRole } from '~/utils/auth.utils'
import { sendVerificationEmail } from '~/utils/mailer'
import { sendForgotPasswordEmail } from '~/utils/verify-forgotpassword-mailer'
import { ErrorWithStatus } from '~/models/Errors'
import { getCitizenIDByUserId, getUserInforByCitizenID } from '~/utils/takeCitizenIDByID'
import { merge } from 'lodash'
//? khi đụng tới database thì đụng tới service
class userService {
  private decodeRefreshToken(refresh_token: string) {
    //hàm nhận vào token và secretOrPublicKey sẽ return về payload
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }
  //!-------------------------------------------------------------------------------------------------------------------||
  //hàm này để kiểm tra email đã tồn tại chưa bằng cách tìm trong database qua đường dẫn databaseService.users.findOne
  //findone trả về 1 document nếu tìm thấy, không tìm thấy thì trả về null
  async checkEmailExist(email: string) {
    const result = await DatabaseService.users.findOne({ email })
    return Boolean(result)
    //!SECTION mình ép kiêu boolean để trả ra true hoặc false
  }
  //!-------------------------------------------------------------------------------------------------------------------||
  async checkCitizenIDExist(citizen_id: string) {
    const collections = [DatabaseService.users, DatabaseService.staffs]

    for (const collection of collections) {
      const result = await collection.findOne({ citizen_id: citizen_id.trim() })
      if (result) return true
    }

    return false
  }

  //!------------------------------------------------------------------------------------------------------------------||
  //? nếu không truyền exp thì mặc định là ngay hết hạn mới
  //?
  private signRefreshToken({
    user_id,
    verify,
    exp,
    user_role
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
    user_role: number
  }) {
    if (exp) {
      //nếu có thì truyền vào
      return signToken({
        payload: { user_id, token_type: TokenTypes.RefreshToken, verify, user_role },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string //thêm
      })
    } else {
      return signToken({
        //nếu không thì thêm options expiresIn: số ngày hết hạn
        payload: { user_id, token_type: TokenTypes.RefreshToken, verify, user_role },
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as any },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string //thêm
      })
    }
  }

  //!------------------------------------------------------------------------------------------
  //! Hàm nhận vào User-id và bỏ vào payload để tạo access token
  //!   refreshToken
  //* vì kí nên hàm này cần bảo mật nên buộc phải private
  //? signAccessToken nhận vào user_id và verify và định nghĩa type của 2 biến này
  //? sử dụng signToken để kí
  private signAccessToken({
    user_id,
    verify,
    user_role
  }: {
    user_id: string
    verify: UserVerifyStatus
    user_role: number
  }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.AccessToken, verify, user_role },
      options: { expiresIn: process.env.EMAIL_VERIFYING_TOKEN_EXPIRE_IN as any },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  //!------------------------------------------------------------------------------------------
  //* HÀM kí tên
  private signAccessRefershToken({
    user_id,
    verify,
    user_role
  }: {
    user_id: string
    verify: UserVerifyStatus
    user_role: number
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, user_role }),
      this.signRefreshToken({ user_id, verify, user_role })
    ])
  }
  //!------------------------------------------------------------------------------------------

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const user = await findUserById(user_id)
    const user_role = Number(user?.role)
    const [access_token, refresh_token] = await this.signAccessRefershToken({ user_id, verify, user_role })
    //TODO: LƯU refresh TOKEN VÀO DATABASE
    //khi tạo acc ta sẽ tạo access_token và refresh_token
    //ta liền decode refresh_token vừa tạo để lấy iat và exp
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    //lưu lại refreshToken, iat, exp và collection refreshTokens mới tạo và nhét vào
    await DatabaseService.RefreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp, user_role })
    )

    if (!user) throw new Error('User not found')

    const role = Number(user.role)

    return { access_token, refresh_token, role }
  }

  //!---------------------------------------------------------------------------------------------------------------------||

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.EmailVerificationToken, verify },
      options: { expiresIn: (process.env.EMAIL_VERIFYING_TOKEN_EXPIRE_IN as any) || '1h' },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }

  //!-------------------------------------------------------------------------------------------
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    const result = await DatabaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        username: `user${user_id.toString()}`,
        //!SECTION trong payload mình có password
        //nhưng trong database mình có hash password
        //dùng để độ lại password trong hasmap thành mã hoá
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth),
        role: UserRole.User
        
      })
    )

    // Gửi email xác thực token cho user sau khi đăng ký thành công
    //!-------------------------------------------------

    await sendVerificationEmail(payload.email, payload.name, email_verify_token)

    //giả lập gửi mail cái mail_verify_token này cho user
    console.log('Email Verify: http://localhost:4000/members/verify-email?email_verify_token=' + email_verify_token)
    return { message: 'Register Successfully' }
  }
  //!------------------------------------------------------------------------------------------
  async logout(refresh_token: string) {
    await DatabaseService.RefreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }
  //!------------------------------------------------------------------------------------------

  async verifyEmail(user_id: string) {
    //* đồng thời tìm users và update lại email_verify_token thành rỗng, verify:1, Updateat: thời gian nào

    const [token] = await Promise.all([
      DatabaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
            updated_at: `$$NOW`
          }
        }
      ])
    ])
  }
  //!------------------------------------------------------------------------------------------

  async resendEmailVerify(user_id: string): Promise<string> {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })

    await DatabaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token,
          updated_at: `$$NOW`
        }
      }
    ])

    return email_verify_token // Trả về để controller dùng
  }
  //!------------------------------------------------------------------------------------------|

  private signforgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.ForgotPasswordToken, verify },
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as any },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
    })
  }
  //!------------------------------------------------------------------------------------------|
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    //hàm này khác với register là không có payload để lấy thông tin user
    //do đó sẽ lấy thông tin user từ database bằng user_id
    //tìm user trong database bằng user_id
    const user = await DatabaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) throw new Error('User not found')
    //tạo forgot_password_token mới
    const forgot_password_token = await this.signforgotPasswordToken({ user_id, verify })
    //TÌM VÀ update lại user bằng forgot_password_token mới và updated_at vào database
    await DatabaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: `$$NOW`
        }
      }
    ])
    //gửi mail cho user
    //thông báo cho user

    await sendForgotPasswordEmail(user.email, user.name, forgot_password_token)
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }
  //!------------------------------------------------------------------------------------------|
  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    //todo: dựa vào user id để tìm user và update lại password
    await DatabaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: '',
          updated_at: `$$NOW`
        }
      }
    ])
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
  }
  //!------------------------------------------------------------------------------------------|
  async getMe(user_id: string) {
    const [users, staffs, admins] = await Promise.all([
      DatabaseService.users.findOne(
        { _id: new ObjectId(user_id) },
        //projecttion chỗ này là để loại bỏ các trường nhạy cảm như password, email_verify_token, forgot_password_token
        //vì khi lấy thông tin user thì không cần thiết phải lấy các trường này
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      ),
      DatabaseService.staffs.findOne(
        { _id: new ObjectId(user_id) },
        //projecttion chỗ này là để loại bỏ các trường nhạy cảm như password, email_verify_token, forgot_password_token
        //vì khi lấy thông tin user thì không cần thiết phải lấy các trường này
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      ),
      DatabaseService.admins.findOne(
        { _id: new ObjectId(user_id) },
        //projecttion chỗ này là để loại bỏ các trường nhạy cảm như password, email_verify_token, forgot_password_token
        //vì khi lấy thông tin user thì không cần thiết phải lấy các trường này
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      )
    ])
    return users || staffs || admins || null
  }
  //!------------------------------------------------------------------------------------------|

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const userObjectId = new ObjectId(user_id)
    const user = await DatabaseService.users.findOne({ _id: userObjectId })
    if (!user) {
      throw new Error('User not found')
    }
    //object chứa key cần update
    const updatePayload: any = { updated_at: new Date() }

    // Format date_of_birth nếu có
    if (payload.date_of_birth) {
      updatePayload.date_of_birth = new Date(payload.date_of_birth)
    }

    // đưa những trường không phải là nest vào 1 bên
    // chạy từng key nếu có trong payload thì cập nhật
    const flatFields = ['name', 'gender', 'citizen_id', 'avatar'] as const
    flatFields.forEach((field) => {
      if (payload[field] !== undefined) {
        updatePayload[field] = payload[field]
      }
    })

    // Nested fields: merge sâu để không mất dữ liệu cũ
    // truyền thiếu trường trong nested vẫn cập nhật được không bị mất
    const nestedFields = ['address'] as const
    nestedFields.forEach((field) => {
      if (payload[field]) {
        updatePayload[field] = merge({}, user[field], payload[field])
      }
    })

    // Thực hiện update
    const result = await DatabaseService.users.findOneAndUpdate(
      { _id: userObjectId },
      { $set: updatePayload },
      {
        returnDocument: 'after',
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 }
      }
    )

    return result
  }
  //!------------------------------------------------------------------------------------------|
  async getCitizenID(user_id: string) {
    const user = await getCitizenIDByUserId(user_id)
    if (!user) throw new Error('The citizenID is not exist ')

    return user
  }
  //!------------------------------------------------------------------------------------------|
  async getUserInforBYCitizenID(citizen_id: string) {
    const user = await getUserInforByCitizenID(citizen_id)
    if (!user) throw new Error('The citizenID does not exist')
    return user
  }
  //!-------------------------------------------------------------------------------------------|
  async createAccessTokenFromRefresh(user_id: string) {
    const access_token = await signToken({
      payload: { user_id },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as any }
    })

    return { access_token }
  }
}
const UserServicess = new userService()
export default UserServicess
