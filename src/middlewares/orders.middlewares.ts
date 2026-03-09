import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { OrderStatus, UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/request/user.requests'
import { validate } from '~/utils/validation'

//!-------------------------------------------------------------------------------------------------|
export const isStaffOrAdminValidator = (req: Request, res: Response, next: NextFunction) => {
  const decoded = req.decode_authorization as any
  const role = Number(decoded.user_role ?? decoded.role)
  console.log('isStaffOrAdminValidator - decoded:', JSON.stringify(decoded))
  console.log('isStaffOrAdminValidator - role:', role)
  if (role !== UserRole.Staff && role !== UserRole.Admin) {
    return next(
      new ErrorWithStatus({
        message: ORDER_MESSAGES.FORBIDDEN_ROLE,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

//!-------------------------------------------------------------------------------------------------|
export const createOrderValidator = validate(
  checkSchema(
    {
      items: {
        isArray: true,
        notEmpty: true
      },
      'items.*.product_id': {
        isString: true,
        notEmpty: true
      },
      'items.*.quantity': {
        isNumeric: true,
        notEmpty: true
      },
      address: {
        isString: true,
        notEmpty: true
      },
      voucher_code: {
        optional: true,
        isString: true
      }
    },
    ['body']
  )
)
export const updateOrderStatusValidator = validate(
  checkSchema(
    {
      status: {
        notEmpty: {
          errorMessage: 'Trạng thái không được để trống'
        },
        isIn: {
          options: [Object.values(OrderStatus)],
          errorMessage: 'Trạng thái không hợp lệ. Chỉ chấp nhận: Pending, Delivering, Delivered, Cancelled'
        }
      }
    },
    ['body']
  )
)
