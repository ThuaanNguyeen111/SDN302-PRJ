import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createReportValidator = validate(
  checkSchema(
    {
      type: {
        isIn: { options: [['comment', 'product', 'order', 'other']], errorMessage: 'Type must be: comment, product, order, or other' },
        notEmpty: { errorMessage: 'Report type is required' }
      },
      target_id: {
        optional: true,
        isString: true,
        trim: true
      },
      reason: {
        isString: true,
        notEmpty: { errorMessage: 'Reason is required' },
        trim: true,
        isLength: { options: { min: 5, max: 500 }, errorMessage: 'Reason must be between 5 and 500 characters' }
      },
      description: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const resolveReportValidator = validate(
  checkSchema(
    {
      status: {
        isIn: { options: [['resolved', 'rejected']], errorMessage: 'Status must be: resolved or rejected' },
        notEmpty: { errorMessage: 'Status is required' }
      },
      resolved_note: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)
