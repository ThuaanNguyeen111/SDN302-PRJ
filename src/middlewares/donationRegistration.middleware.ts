// middlewares/donationRegistration.middleware.ts
import { checkSchema } from 'express-validator'
import { DONATION_REGISTRATION_MESSAGES } from '~/constants/donationRegistration.message'
import { validate } from '~/utils/validation'

export const donationRegistrationValidator = validate(
  checkSchema(
    {
      donation_id: {
        notEmpty: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.DONATION_ID_REQUIRED
        },
        isMongoId: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.DONATION_ID_INVALID
        }
      },
      medical_condition: {
        notEmpty: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.MEDICAL_CONDITION_REQUIRED
        },
        isString: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.MEDICAL_CONDITION_INVALID
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.QUANTITY_REQUIRED
        },
        isInt: {
          options: { min: 100, max: 500 },
          errorMessage: DONATION_REGISTRATION_MESSAGES.QUANTITY_INVALID
        }
      },
      note: {
        optional: true,
        isString: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.NOTE_INVALID
        }
      }
    },
    ['body']
  )
)

export const updateMemberInDonationValidator = validate(
  checkSchema(
    {
      blood_type: {
        optional: true,
        isString: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.BLOOD_TYPE_INVALID
        }
      },
      last_donation_date: {
        optional: true,
        isISO8601: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.LAST_DONATION_DATE_INVALID
        }
      },
      medical_condition: {
        optional: true,
        isString: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.MEDICAL_CONDITION_INVALID
        }
      },
      quantity: {
        optional: true,
        isInt: {
          options: { min: 100, max: 500 },
          errorMessage: DONATION_REGISTRATION_MESSAGES.QUANTITY_INVALID
        }
      },
      note: {
        optional: true,
        isString: {
          errorMessage: DONATION_REGISTRATION_MESSAGES.NOTE_INVALID
        }
      },
      memberStatus: {
        optional: true,
        isIn: {
          options: [['PENDING', 'APPROVED', 'REJECTED']],
          errorMessage: DONATION_REGISTRATION_MESSAGES.MEMBER_STATUS_INVALID
        }
      }
    },
    ['body']
  )
)
