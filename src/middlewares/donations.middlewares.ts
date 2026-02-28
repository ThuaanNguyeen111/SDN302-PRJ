import { checkSchema } from 'express-validator'
import { DONATION_MESSAGES } from '~/constants/donation.message'
import { REGEX_TIME_IN_VALIDATOR, REGEX_TIME_OUT_VALIDATOR } from '~/constants/regex'
import { validate } from '~/utils/validation'

export const createDonationValidator = validate(
  checkSchema(
    {
      'appointment_details.date': {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.DATE_REQUIRED
        },
        isISO8601: {
          errorMessage: DONATION_MESSAGES.DATE_INVALID
        }
      },
      'appointment_details.time_in': {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.TIME_IN_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!REGEX_TIME_IN_VALIDATOR.test(value)) {
              throw new Error(DONATION_MESSAGES.TIME_IN_INVALID)
            }
            return true
          }
        }
      },
      'appointment_details.time_out': {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.TIME_OUT_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!REGEX_TIME_OUT_VALIDATOR.test(value)) {
              throw new Error(DONATION_MESSAGES.TIME_OUT_INVALID)
            }
            return true
          }
        }
      },
      // Facility
      facility_assignment: {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.FACILITY_ID_REQUIRED
        },
        isString: {
          errorMessage: 'Facility assignment must be a string'
        }
      },

      // Capacity
      'capacity.max_count_slot': {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.MAX_SLOT_REQUIRED
        },
        isInt: {
          options: { min: 1 },
          errorMessage: DONATION_MESSAGES.MAX_SLOT_INVALID
        }
      },

      // Notes
      note: {
        optional: true,
        isString: {
          errorMessage: DONATION_MESSAGES.ADDITIONAL_NOTES_MUST_BE_STRING
        }
      },

      staff_assignment: {
        optional: true
      },
      'staff_assignment.*.note': {
        optional: true,
        isString: {
          errorMessage: DONATION_MESSAGES.STAFF_NOTE_MUST_BE_STRING
        }
      }
    },
    ['body']
  )
)

export const updateStaffAssignmentValidator = validate(
  checkSchema(
    {
      staff_assignment: {
        notEmpty: {
          errorMessage: 'Staff assignment is required' // replaced invalid constant
        },
        isArray: {
          errorMessage: DONATION_MESSAGES.STAFF_ASSIGNMENT_MUST_BE_ARRAY
        }
      },
      'staff_assignment.*._id': {
        notEmpty: {
          errorMessage: DONATION_MESSAGES.STAFF_ID_REQUIRED
        },
        isMongoId: {
          errorMessage: DONATION_MESSAGES.STAFF_ID_INVALID
        }
      }
    },
    ['body']
  )
)
