import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const checkVoucherValidator = validate(
  checkSchema(
    {
      code: {
        isString: true,
        notEmpty: true,
        trim: true
      },
      total_amount: {
        isNumeric: true,
        notEmpty: true
      }
    },
    ['body']
  )
)

export const createVoucherValidator = validate(
  checkSchema(
    {
      code: { isString: true, notEmpty: true, trim: true },
      discount_type: { isIn: { options: [['amount', 'percentage']] } },
      discount_value: { isNumeric: true, notEmpty: true },
      min_order_value: { isNumeric: true, optional: true },
      start_date: { isISO8601: true, notEmpty: true },
      end_date: { isISO8601: true, notEmpty: true },
      usage_limit: { isNumeric: true, notEmpty: true }
    },
    ['body']
  )
)
