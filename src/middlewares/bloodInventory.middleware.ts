import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import { ParamSchema, check, checkSchema } from 'express-validator'
import { BLOOD_INVENTORY_MESSAGES } from '~/constants/bloodInventory'

const nameSchema: ParamSchema = {
  notEmpty: { errorMessage: BLOOD_INVENTORY_MESSAGES.NAME_IS_REQUIRED }, //? xài hàm không cần dấu ()
  isString: { errorMessage: BLOOD_INVENTORY_MESSAGES.NAME_MUST_BE_A_STRING },
  trim: true
}
export const getAllBloodbyNameValidator = validate(
  checkSchema(
    {
      name: nameSchema
    },
    ['body']
  )
)

export const updateBloodInforValidator = validate(
  checkSchema(
    {
      name: {
        //cho phép có thể cập nhật trường này hoặc không
        //Không nhất thiết phải cập nhật tất cả trường
        optional: true,
        isString: { errorMessage: BLOOD_INVENTORY_MESSAGES.NAME_MUST_BE_A_STRING },
        trim: true
      },

      status: {
        optional: true,
        isString: { errorMessage: BLOOD_INVENTORY_MESSAGES.STATUS_MUST_BE_STRING },
        isUppercase: { errorMessage: BLOOD_INVENTORY_MESSAGES.STATUS_MUST_BE_UPPERCASE }
      },
      'units.*.quantity': {
        optional: true,
        isNumeric: { errorMessage: BLOOD_INVENTORY_MESSAGES.UNIT_QUANTITY_MUST_BE_NUMBER }
      },
      'units.*.expirationDate': {
        optional: true,
        isISO8601: { errorMessage: BLOOD_INVENTORY_MESSAGES.EXPIRATION_DATE_INVALID }
      }
    },
    ['body']
  )
)

export const inputUnitValidator = validate(
  checkSchema(
    {
      'units.*.quantity': {
        optional: true,
        isNumeric: { errorMessage: BLOOD_INVENTORY_MESSAGES.UNIT_QUANTITY_MUST_BE_NUMBER }
      },
      'units.*.expirationDate': {
        optional: true,
        isISO8601: { errorMessage: BLOOD_INVENTORY_MESSAGES.EXPIRATION_DATE_INVALID }
      },
      'units.*.collectionDate': {
        optional: true,
        isISO8601: { errorMessage: BLOOD_INVENTORY_MESSAGES.COLLECTION_DATE_INVALID }
      }
    },
    ['body']
  )
)
export const updateUnitInventoryValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: BLOOD_INVENTORY_MESSAGES.NAME_MUST_BE_A_STRING },
        trim: true
      },
      'units.*.quantity': {
        optional: true,
        isNumeric: { errorMessage: BLOOD_INVENTORY_MESSAGES.UNIT_QUANTITY_MUST_BE_NUMBER }
      },
      'units.*.expirationDate': {
        optional: true,
        isISO8601: { errorMessage: BLOOD_INVENTORY_MESSAGES.EXPIRATION_DATE_INVALID }
      },
      'units.*.collectionDate': {
        optional: true,
        isISO8601: { errorMessage: BLOOD_INVENTORY_MESSAGES.COLLECTION_DATE_INVALID }
      }
    },
    ['body']
  )
)
