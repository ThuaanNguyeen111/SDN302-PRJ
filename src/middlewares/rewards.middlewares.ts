import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createRewardValidator = validate(
  checkSchema(
    {
      name: { isString: true, notEmpty: { errorMessage: 'Reward name is required' }, trim: true },
      points_required: { isNumeric: true, notEmpty: { errorMessage: 'Points required is required' } },
      stock: { isNumeric: true, notEmpty: { errorMessage: 'Stock is required' } },
      description: { optional: true, isString: true, trim: true },
      image: { optional: true, isString: true, trim: true }
    },
    ['body']
  )
)

export const redeemRewardValidator = validate(
  checkSchema(
    {
      reward_id: {
        isString: true,
        notEmpty: { errorMessage: 'Reward ID is required' },
        trim: true,
        isMongoId: { errorMessage: 'Invalid reward ID' }
      }
    },
    ['body']
  )
)
