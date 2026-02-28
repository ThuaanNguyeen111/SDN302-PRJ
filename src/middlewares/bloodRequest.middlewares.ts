import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { BLOOD_REQUEST_MESSAGES } from '~/constants/bloodrequest.message'

export const createBloodRequestValidator = validate(
  checkSchema(
    {
      required_volume: {
        notEmpty: {
          errorMessage: BLOOD_REQUEST_MESSAGES.VOLUME_REQUIRED // 👈 nên thêm key mới thay vì dùng UNITS_REQUIRED
        },
        isInt: {
          options: { min: 50 },
          errorMessage: BLOOD_REQUEST_MESSAGES.VOLUME_INVALID
        }
      },
      urgency_level: {
        notEmpty: {
          errorMessage: BLOOD_REQUEST_MESSAGES.URGENCY_REQUIRED
        },
        isString: {
          errorMessage: BLOOD_REQUEST_MESSAGES.URGENCY_INVALID
        },
        isIn: {
          options: [['critical', 'high', 'medium', 'low']],
          errorMessage: BLOOD_REQUEST_MESSAGES.URGENCY_INVALID
        }
      },
      additional_info: {
        optional: true,
        isString: {
          errorMessage: BLOOD_REQUEST_MESSAGES.ADDITIONAL_INFO_INVALID
        }
      },
      created_by: {
        optional: true,
        isMongoId: {
          errorMessage: BLOOD_REQUEST_MESSAGES.INVALID_CREATED_BY
        }
      }
    },
    ['body']
  )
)
