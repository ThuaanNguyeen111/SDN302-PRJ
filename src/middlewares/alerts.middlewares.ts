import { checkSchema } from 'express-validator'
import { ALERT_MESSAGES } from '~/constants/alert.message'
import { AlertStatus } from '~/constants/enums'
import { validate } from '~/utils/validation'

export const alertValidator = validate(
  checkSchema(
    {
      staff_citizen_id: {
        notEmpty: { errorMessage: ALERT_MESSAGES.STAFF_CITIZEN_ID_REQUIRED },
        isString: { errorMessage: ALERT_MESSAGES.STAFF_CITIZEN_ID_REQUIRED },
        trim: true
      },
      member_citizen_id: {
        notEmpty: { errorMessage: ALERT_MESSAGES.MEMBER_CITIZEN_ID_REQUIRED },
        isString: { errorMessage: ALERT_MESSAGES.MEMBER_CITIZEN_ID_REQUIRED },
        trim: true
      },
      'request_details.blood_type': {
        notEmpty: { errorMessage: ALERT_MESSAGES.BLOOD_TYPE_REQUIRED },
        isString: { errorMessage: ALERT_MESSAGES.BLOOD_TYPE_REQUIRED },
        trim: true
      },
      'request_details.quantity': {
        notEmpty: { errorMessage: ALERT_MESSAGES.QUANTITY_REQUIRED },
        isInt: {
          options: { min: 1 },
          errorMessage: ALERT_MESSAGES.QUANTITY_INVALID
        }
      },
      'request_details.urgency_level': {
        notEmpty: { errorMessage: ALERT_MESSAGES.URGENCY_REQUIRED },
        isIn: {
          options: [['STANDARD', 'MEDIUM', 'HIGH', 'CRITICAL']],
          errorMessage: ALERT_MESSAGES.URGENCY_INVALID
        }
      },
      'request_details.request_date': {
        notEmpty: { errorMessage: ALERT_MESSAGES.APPOINTMENT_DATE_REQUIRED },
        isISO8601: { errorMessage: ALERT_MESSAGES.APPOINTMENT_DATE_INVALID }
      },
      'request_details.unit_info._id': {
        notEmpty: { errorMessage: ALERT_MESSAGES.UNIT_ID_REQUIRED },
        isMongoId: { errorMessage: ALERT_MESSAGES.UNIT_ID_INVALID }
      },
      'request_details.note': {
        optional: true,
        isString: { errorMessage: ALERT_MESSAGES.NOTE_INVALID },
        trim: true
      },
      'request_details.facility._id': {
        notEmpty: { errorMessage: ALERT_MESSAGES.FACILITY_ID_REQUIRED },
        isMongoId: { errorMessage: ALERT_MESSAGES.FACILITY_ID_INVALID }
      },
      'request_details.facility.name': {
        optional: true,
        isString: { errorMessage: ALERT_MESSAGES.FACILITY_NAME_INVALID },
        trim: true
      },
      'request_details.facility.contactOwner.name': {
        optional: true,
        isString: { errorMessage: ALERT_MESSAGES.CONTACT_OWNER_NAME_INVALID },
        trim: true
      },
      'request_details.facility.contactOwner.phone_number': {
        optional: true,
        isMobilePhone: {
          options: ['vi-VN'],
          errorMessage: ALERT_MESSAGES.CONTACT_OWNER_PHONE_INVALID
        }
      }
    },
    ['body']
  )
)

//  Cập nhật alert
export const updateAlertValidator = validate(
  checkSchema(
    {
      quantity: {
        optional: true,
        isInt: {
          options: { min: 1 },
          errorMessage: ALERT_MESSAGES.QUANTITY_INVALID
        }
      },
      request_date: {
        optional: true,
        isISO8601: { errorMessage: ALERT_MESSAGES.APPOINTMENT_DATE_INVALID }
      },
      note: {
        optional: true,
        isString: { errorMessage: ALERT_MESSAGES.NOTE_INVALID },
        trim: true
      },
      urgency_level: {
        optional: true,
        isIn: {
          options: [['STANDARD', 'MEDIUM', 'HIGH', 'CRITICAL']],
          errorMessage: ALERT_MESSAGES.URGENCY_INVALID
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [...Object.values(AlertStatus)],
          errorMessage: ALERT_MESSAGES.STATUS_INVALID
        }
      }
    },
    ['body']
  )
)

//  Xử lý alert (resolve)
export const resolveAlertValidator = validate(
  checkSchema(
    {
      note: {
        optional: true,
        isString: { errorMessage: ALERT_MESSAGES.NOTE_INVALID },
        trim: true
      }
    },
    ['body']
  )
)
