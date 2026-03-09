import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { PRODUCT_MESSAGES } from '~/constants/product.message'

export const createProductValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: { errorMessage: PRODUCT_MESSAGES.NAME_IS_REQUIRED },
        isString: { errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_200
        },
        trim: true
      },
      description: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_A_STRING },
        trim: true
      },
      category: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.CATEGORY_MUST_BE_A_STRING },
        trim: true
      },
      price: {
        notEmpty: { errorMessage: PRODUCT_MESSAGES.PRICE_IS_REQUIRED },
        isFloat: {
          options: { gt: 0 },
          errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_POSITIVE
        }
      },
      stock_quantity: {
        notEmpty: { errorMessage: PRODUCT_MESSAGES.STOCK_QUANTITY_IS_REQUIRED },
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCT_MESSAGES.STOCK_QUANTITY_MUST_BE_NON_NEGATIVE
        }
      },
      image_url: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.IMAGE_URL_MUST_BE_A_STRING },
        trim: true
      },
      brand: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.BRAND_MUST_BE_A_STRING },
        trim: true
      },
      age_range: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.AGE_RANGE_MUST_BE_A_STRING },
        trim: true
      }
    },
    ['body']
  )
)

export const updateProductValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.NAME_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: PRODUCT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_200
        },
        trim: true
      },
      description: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_A_STRING },
        trim: true
      },
      category: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.CATEGORY_MUST_BE_A_STRING },
        trim: true
      },
      price: {
        optional: true,
        isFloat: {
          options: { gt: 0 },
          errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_POSITIVE
        }
      },
      stock_quantity: {
        optional: true,
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCT_MESSAGES.STOCK_QUANTITY_MUST_BE_NON_NEGATIVE
        }
      },
      image_url: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.IMAGE_URL_MUST_BE_A_STRING },
        trim: true
      },
      brand: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.BRAND_MUST_BE_A_STRING },
        trim: true
      },
      age_range: {
        optional: true,
        isString: { errorMessage: PRODUCT_MESSAGES.AGE_RANGE_MUST_BE_A_STRING },
        trim: true
      },
      allow_preorder: {
        optional: true,
        isBoolean: { errorMessage: PRODUCT_MESSAGES.ALLOW_PREORDER_MUST_BE_BOOLEAN }
      }
    },
    ['body']
  )
)
