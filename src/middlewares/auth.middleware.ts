
///import các interface để định dạng kiểu cho para của middlewares

import { ParamSchema, check, checkSchema } from 'express-validator'

import { USERS_MESSAGES } from '~/constants/message'

import DatabaseService from '~/services/database.services'

import { hashPassword } from '~/utils/crypto'

import { validate } from '~/utils/validation'


const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
        isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (email, { req }) => {
            const hashedPassword = hashPassword(req.body.password)

            // Kiểm tra trong các collection admin, staff, user
            const collections = [DatabaseService.admins, DatabaseService.staffs, DatabaseService.users]

            for (const collection of collections) {
              const user = await collection.findOne({ email, password: hashedPassword })
              if (user) {
                req.user = user // Gán user cho req để controller dùng
                return true
              }
            }

            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
        trim: true,
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)
