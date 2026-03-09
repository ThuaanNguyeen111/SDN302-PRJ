import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'

export const createReviewValidator = validate(
  checkSchema(
    {
      productId: {
        in: ['params'],
        custom: {
          options: (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error('Invalid product ID format')
            }
            return true
          }
        }
      },
      rating: {
        notEmpty: { errorMessage: 'Rating is required' },
        isInt: {
          options: { min: 1, max: 5 },
          errorMessage: 'Rating must be an integer between 1 and 5'
        }
      },
      comment: {
        notEmpty: { errorMessage: 'Comment is required' },
        isString: { errorMessage: 'Comment must be a string' },
        trim: true,
        isLength: {
          options: { min: 5, max: 500 },
          errorMessage: 'Comment length must be from 5 to 500 characters'
        }
      }
    },
    ['body', 'params']
  )
)
