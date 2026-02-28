import { Address } from './../models/request/user.requests'
///import các interface để định dạng kiểu cho para của middlewares
import { Request, Response, NextFunction } from 'express'
import { ParamSchema, check, checkSchema } from 'express-validator'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import moment from 'moment-timezone'
import { ObjectId } from 'mongodb'
import { validate } from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/message'
import { FACILITIES_MESSAGES } from '~/constants/facility.message'

export const facilityValidator = validate(
  checkSchema(
    {
      facility_name: {
        isString: { errorMessage: FACILITIES_MESSAGES.FACILITY_NAME_MUST_BE_STRING },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_IS_REQUIRED }
      },
      description: {
        optional: true,
        isString: { errorMessage: FACILITIES_MESSAGES.FACILITY_MUST_BE_STRING },
        trim: true
      },

      'contact_owner.name': {
        isString: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_MUST_BE_STRING },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_IS_REQUIRED }
      },
      'contact_owner.phone_number': {
        isNumeric: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_PHONE_NUMBER_MUST_BE_A_NUMBER },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_PHONE_NUMBER_IS_REQUIRED }
      },
      'address.street': {
        isString: { errorMessage: USERS_MESSAGES.STREET_MUST_BE_STRING },
        trim: true
      },
      'address.ward': {
        isString: { errorMessage: USERS_MESSAGES.WARD_MUST_BE_STRING },
        trim: true
      },
      'address.district': {
        isString: { errorMessage: USERS_MESSAGES.DISTRICT_MUST_BE_STRING },
        trim: true
      },
      'address.city': {
        isString: { errorMessage: USERS_MESSAGES.CITY_MUST_BE_STRING },
        trim: true
      },
      'address.country': {
        isString: { errorMessage: USERS_MESSAGES.COUNTRY_MUST_BE_STRING },
        trim: true
      },
      'address.zipcode': {
        isNumeric: { errorMessage: USERS_MESSAGES.ZIPCODE_MUST_BE_A_NUMBER },
        trim: true,
        isLength: {
          options: {
            min: 3,
            max: 6
          }
        }
      }
    },
    ['body']
  )
)

export const getFacilityByNameValidation = validate(
  checkSchema(
    {
      facility_name: {
        isString: { errorMessage: FACILITIES_MESSAGES.FACILITY_NAME_MUST_BE_STRING },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_IS_REQUIRED }
      }
    },
    ['body']
  )
)

export const updateFacilityInforValidator = validate(
  checkSchema(
    {
      facility_name: {
        optional: true,
        isString: { errorMessage: FACILITIES_MESSAGES.FACILITY_NAME_MUST_BE_STRING },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_IS_REQUIRED }
      },
      description: {
        optional: true,
        isString: { errorMessage: FACILITIES_MESSAGES.FACILITY_MUST_BE_STRING },
        trim: true
      },

      'contact_owner.name': {
        optional: true,
        isString: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_MUST_BE_STRING },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_NAME_IS_REQUIRED }
      },
      'contact_owner.phone_number': {
        optional: true,
        isNumeric: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_PHONE_NUMBER_MUST_BE_A_NUMBER },
        trim: true,
        notEmpty: { errorMessage: FACILITIES_MESSAGES.CONTACT_OWNER_PHONE_NUMBER_IS_REQUIRED }
      },
      'address.street': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.STREET_MUST_BE_STRING },
        trim: true
      },
      'address.ward': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.WARD_MUST_BE_STRING },
        trim: true
      },
      'address.district': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.DISTRICT_MUST_BE_STRING },
        trim: true
      },
      'address.city': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.CITY_MUST_BE_STRING },
        trim: true
      },
      'address.country': {
        optional: true,
        isString: { errorMessage: USERS_MESSAGES.COUNTRY_MUST_BE_STRING },
        trim: true
      },
      'address.zipcode': {
        optional: true,
        isNumeric: { errorMessage: USERS_MESSAGES.ZIPCODE_MUST_BE_A_NUMBER },
        trim: true,
        isLength: {
          options: {
            min: 3,
            max: 6
          }
        }
      }
    },
    ['body']
  )
)
