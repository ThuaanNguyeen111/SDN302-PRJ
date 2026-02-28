import { Address } from './../models/request/user.requests'
///import các interface để định dạng kiểu cho para của middlewares
import { Request, Response, NextFunction } from 'express'
import { ParamSchema, check, checkSchema } from 'express-validator'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import DatabaseService from '~/services/database.services'
import UserServicess from '~/services/users.servicec'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { JsonWebTokenError } from 'jsonwebtoken'
import moment from 'moment-timezone'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '~/models/request/user.requests'
import { UserVerifyStatus } from '~/constants/enums'
import { REGEX_USERNAME } from '~/constants/regex'

//?Bắt buộc phải bổ nghĩa ở req ,res và next nếu không sẽ lỗi
//* 3 thằng này là interface cho express cung cấp, thì ta sẽ sử dụng để bổ nghĩa những
//* parameter req, res, next
//------------------------------------------------------
const nameSchema: ParamSchema = {
  //! search tất cả chức năng trên MD số 4-5
  notEmpty: { errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED }, //? xài hàm không cần dấu ()
  isString: { errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING },

  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 100
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  //! kiểm tra độ mạnh password
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      //? nếu returnScore thì nó sẽ trả ra điểm từ 1-10 để hiện thị độ mạnh passowrd
      //? còn nếu set ở thể false thì nó chỉ trả ra mạnh hay yếu
      returnScore: false
    }
  },
  errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,

  //! Kiểm tra cố trùng với password hay không
  custom: {
    //value là giá trị của confirm_password
    options: (value, { req }) => {
      if (value !== req.body.password) {
        //* Quăng lỗi để về sau mình tập kết lỗi
        throw new Error('Passwords do not match')
      }
      //! TODO- Bắt buộc phải return true để kết thúc nêu
      // không sẽ bị kẹt ở đây
      return true
    }
  }
}

const passwordSchema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
  trim: true,
  isLength: {
    options: {
      min: 6,
      max: 100
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  // //! kiểm tra độ mạnh password
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      //     //? nếu returnScore thì nó sẽ trả ra điểm từ 1-10 để hiện thị độ mạnh passowrd
      //     //? còn nếu set ở thể false thì nó chỉ trả ra mạnh hay yếu
      returnScore: false
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  },

  errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
}
//!------------------------------------------------------------------------------------------------|
//chuyển ngày tháng người dùng sang iso string bằng npm install express-validator moment
//npm install moment-timezone
const dateOfBirhSchema: ParamSchema = {
  customSanitizer: {
    options: (value) => {
      //
      const parsed = moment.tz(value, ['D/M/YYYY', 'DD/MM/YYYY'], true, 'Asia/Ho_Chi_Minh')
      if (parsed.isValid()) {
        //"15/07/2020
        //đưa giờ về 00:00:00 để tránh sai lệch giờ giữa client/server.
        return parsed.startOf('day').toISOString()
      }
      return value
    }
  },
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    }
  },
  errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
}

//!------------------------------------------------------------------------------------------------
//ctrl+ tab vào checkSchema để xem cách sử dụng
//để xem checkSchema có những gì
//ctrl+ tab vào checkSchema để xem cách sử dụng
//để xem checkSchema có những gì
export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      gender: {
        notEmpty: { errorMessage: USERS_MESSAGES.GENDER_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.GENDER_MUST_BE_A_STRING }
      },
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isExist = await UserServicess.checkEmailExist(value)
            if (isExist) {
              throw new Error('Email already exists')
            }
            return true
          }
        }
      },
      citizen_id: {
        notEmpty: { errorMessage: USERS_MESSAGES.CITIZEN_ID_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.CITIZEN_ID_MUST_BE_A_STRING },
        trim: true,
        isLength: {
          options: {
            min: 12,
            max: 12
          },
          errorMessage: USERS_MESSAGES.CITIZEN_ID_LENGTH_MUST_HAVE_12_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await UserServicess.checkCitizenIDExist(value)
            if (isExist) {
              throw new Error('Citizen ID already exists')
            }
            return true
          }
        }
      },
      // KIỂU ARESS LÀ OBJECT
      'address.street': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.STREET_MUST_BE_STRING },
        trim: true
      },
      'address.ward': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.WARD_MUST_BE_STRING },
        trim: true
      },
      'address.district': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.DISTRICT_MUST_BE_STRING },
        trim: true
      },
      'address.city': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.CITY_MUST_BE_STRING },
        trim: true
      },
      'address.country': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.COUNTRY_MUST_BE_STRING },
        trim: true
      },
      'address.zipcode': {
        optional: true,
        isNumeric: { errorMessage: USERS_MESSAGES.ZIPCODE_MUST_BE_A_NUMBER },
        trim: true,
        isLength: {
          options: {
            min: 3,
            max: 6
          }
        }
      },
      'emergency_contact.name': {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.EMERGENCY_CONTACT_NAME_MUST_BE_STRING
        },
        trim: true
      },
      'emergency_contact.phoneNumber': {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.EMERGENCY_CONTACT_PHONE_MUST_BE_STRING
        },
        trim: true
      },

      password: passwordSchema,
      confirm_password: confirmPasswordSchema,

      date_of_birth: dateOfBirhSchema
    },
    ['body']
  )
)

//!------------------------------------------------------------------------------------------------|
//! ACCESS TOKEN VALIDATOR CHO CÁC ROUTE CẦN PHẢI XÁC THỰC NGƯỜI DÙNG
//! BEARER<accessToken>
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const accessToken = value.split(' ')[1] //lấy phần tử thứ nhất trong mảng
            //!SECTION nếu không có access token thì ném lỗi 401
            // còn nếu có thì verify access token lấy ra decoded_authorization
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED //401
              })
            }
            try {
              //* nếu có accessToken thì mình phải verify AccessToken
              //* lấy ra decoded_authorization(payload) và lưu vào req, dùng dần
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })

              ;(req as Request).decode_authorization = decoded_authorization
              ;(req as Request).user = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
//!------------------------------------------------------------------------------------------------|
export const refreshTokenValidator = validate(
  checkSchema(
    {
      //TODO - đầu tiên
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            //verifyrefresh_token để lấy decoded_refresh_token
            //! sử DỤNG TRY CATCH để bắt LOOXI KHÔNG ĐỂ VÀO VALIDATE
            try {
              const [decode_refresh_Token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                }),
                DatabaseService.RefreshTokens.findOne({
                  token: value
                })
              ])
              //todo - tìm trong database xem córefresh_token này không ?

              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decode_refresh_token = decode_refresh_Token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              //! nếu không phải là JsonWebTokenError thì mình se xử lý lỗi trên try
              // và tiếp tục throw lỗi ở đây
              // còn nếu là JsonWebTokenError thì mình đã xử lý
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

//!------------------------------------------------------------------------------------------------|
export const emailVerifyValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //*------------------------------------------------------------
            //! nếu email_verify_token không gửi lên thì respond lỗi
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            //*------------------------------------------------------------
            try {
              const decode_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })
              //todo - tìm trong database xem córefresh_token này không ?
              ;(req as Request).decode_email_verify_token = decode_email_verify_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              //! nếu không phải là JsonWebTokenError thì mình se xử lý lỗi trên try
              // và tiếp tục throw lỗi ở đây
              // còn nếu là JsonWebTokenError thì mình đã xử lý
              throw error
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
//!------------------------------------------------------------------------------------------------|
export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //* tìm user có email này
            const user = await DatabaseService.users.findOne({ email: value })
            // nếu  không óc thì ko gửi được, trả về lỗi
            if (user === null) {
              throw new Error(USERS_MESSAGES.NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

//!------------------------------------------------------------------------------------------------|
export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //*------------------------------------------------------------
            //! nếu email_verify_token không gửi lên thì respond lỗi
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            //*------------------------------------------------------------
            try {
              const decode_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })
              //todo - tìm trong database xem có refresh_token này không ?
              ;(req as Request).decode_forgot_password_token = decode_forgot_password_token

              //? tùm user có user_id đó
              const { user_id } = decode_forgot_password_token
              const user = await DatabaseService.users.findOne({
                _id: new ObjectId(user_id)
              })
              //nếu không có thì respond lỗi
              if (user === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              if (user.forgot_password_token != value) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_FORGOT_PASSWORD_INCORRECT,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              //! nếu không phải là JsonWebTokenError thì mình se xử lý lỗi trên try
              // và tiếp tục throw lỗi ở đây
              // còn nếu là JsonWebTokenError thì mình đã xử lý
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
//!------------------------------------------------------------------------------------------------|
export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)
//!------------------------------------------------------------------------------------------------|
export const verifyfiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decode_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN //403
      })
    )
  }
  next()
}
//!------------------------------------------------------------------------------------------------|
const imageSchema: ParamSchema = {
  optional: true,
  isString: { errorMessage: USERS_MESSAGES.IMAGE_MUST_BE_A_STRING },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: USERS_MESSAGES.IMAGE_LENGTH_MUST_BE_FROM_1_TO_400
  }
}
//-------------------------------------------------------------------------------------------------|
export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema, //phân rã nameSchema ra
        optional: true, //đc phép có hoặc k
        isString: { errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING },

        notEmpty: undefined //ghi đè lên notEmpty của nameSchema
      },
      date_of_birth: {
        optional: true, //đc phép có hoặc k
        ...dateOfBirhSchema, //phân rã dateOfBirhSchema ra
        notEmpty: undefined //ghi đè lên notEmpty của nameSchema
      },
      gender: {
        optional: true,
        notEmpty: { errorMessage: USERS_MESSAGES.GENDER_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.GENDER_MUST_BE_A_STRING }
      },
      citizen_id: {
        optional: true,
        // isString: { errorMessage: USERS_MESSAGES.CITIZEN_ID_MUST_BE_A_STRING },
        isNumeric: {
          errorMessage: USERS_MESSAGES.CITIZEN_ID_MUST_BE_A_NUMBER
        },
        trim: true,
        isLength: {
          options: {
            min: 12,
            max: 12
          },
          errorMessage: USERS_MESSAGES.CITIZEN_ID_LENGTH_MUST_HAVE_12_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await UserServicess.checkCitizenIDExist(value)
            if (!isExist) {
              throw new Error('Citizen ID is not exist')
            }
            return true
          }
        }
      },

      'address.street': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.STREET_MUST_BE_STRING },
        trim: true
      },
      'address.ward': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.WARD_MUST_BE_STRING },
        trim: true
      },
      'address.district': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.DISTRICT_MUST_BE_STRING },
        trim: true
      },
      'address.city': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.CITY_MUST_BE_STRING },
        trim: true
      },
      'address.country': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.COUNTRY_MUST_BE_STRING },
        trim: true
      },
      'address.zipcode': {
        optional: true,
        isNumeric: { errorMessage: USERS_MESSAGES.ZIPCODE_MUST_BE_A_NUMBER },
        trim: true,
        isLength: {
          options: {
            min: 3,
            max: 6
          }
        }
      },
      'emergency_contact.name': {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.EMERGENCY_CONTACT_NAME_MUST_BE_STRING
        },
        trim: true
      },
      'emergency_contact.phoneNumber': {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.EMERGENCY_CONTACT_PHONE_MUST_BE_STRING
        },
        trim: true
      },

      avatar: imageSchema
    },
    ['body']
  )
)
export const getCitizenIDValidator = validate(
  checkSchema(
    {
      citizen_id: {
        notEmpty: { errorMessage: USERS_MESSAGES.CITIZEN_ID_IS_REQUIRED },
        // isString: { errorMessage: USERS_MESSAGES.CITIZEN_ID_MUST_BE_A_STRING },
        isNumeric: {
          errorMessage: USERS_MESSAGES.CITIZEN_ID_MUST_BE_A_NUMBER
        },
        trim: true,
        isLength: {
          options: {
            min: 12,
            max: 12
          },
          errorMessage: USERS_MESSAGES.CITIZEN_ID_LENGTH_MUST_HAVE_12_NUMBER
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await UserServicess.checkCitizenIDExist(value)
            if (!isExist) {
              throw new Error('Citizen ID is not exist')
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
//!------------------------------------------------------------------------------------------------|
