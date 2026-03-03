import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { POST_MESSAGES } from '~/constants/post.message'

export const createPostValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: { errorMessage: POST_MESSAGES.TITLE_IS_REQUIRED },
        isString: { errorMessage: POST_MESSAGES.TITLE_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 300 },
          errorMessage: POST_MESSAGES.TITLE_LENGTH_MUST_BE_FROM_1_TO_300
        },
        trim: true
      },
      content: {
        notEmpty: { errorMessage: POST_MESSAGES.CONTENT_IS_REQUIRED },
        isString: { errorMessage: POST_MESSAGES.CONTENT_MUST_BE_A_STRING },
        trim: true
      },
      thumbnail: {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.THUMBNAIL_MUST_BE_A_STRING },
        trim: true
      },
      suggested_products: {
        optional: true,
        isArray: { errorMessage: POST_MESSAGES.SUGGESTED_PRODUCTS_MUST_BE_AN_ARRAY }
      },
      'suggested_products.*': {
        isString: { errorMessage: POST_MESSAGES.SUGGESTED_PRODUCT_ID_MUST_BE_A_STRING }
      },
      tags: {
        optional: true,
        isArray: { errorMessage: POST_MESSAGES.TAGS_MUST_BE_AN_ARRAY }
      },
      'tags.*': {
        isString: { errorMessage: POST_MESSAGES.TAG_MUST_BE_A_STRING },
        trim: true
      },
      status: {
        optional: true,
        isIn: {
          options: [[0, 1]],
          errorMessage: POST_MESSAGES.STATUS_MUST_BE_0_OR_1
        }
      }
    },
    ['body']
  )
)

export const updatePostValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.TITLE_MUST_BE_A_STRING },
        isLength: {
          options: { min: 1, max: 300 },
          errorMessage: POST_MESSAGES.TITLE_LENGTH_MUST_BE_FROM_1_TO_300
        },
        trim: true
      },
      content: {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.CONTENT_MUST_BE_A_STRING },
        trim: true
      },
      thumbnail: {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.THUMBNAIL_MUST_BE_A_STRING },
        trim: true
      },
      suggested_products: {
        optional: true,
        isArray: { errorMessage: POST_MESSAGES.SUGGESTED_PRODUCTS_MUST_BE_AN_ARRAY }
      },
      'suggested_products.*': {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.SUGGESTED_PRODUCT_ID_MUST_BE_A_STRING }
      },
      tags: {
        optional: true,
        isArray: { errorMessage: POST_MESSAGES.TAGS_MUST_BE_AN_ARRAY }
      },
      'tags.*': {
        optional: true,
        isString: { errorMessage: POST_MESSAGES.TAG_MUST_BE_A_STRING },
        trim: true
      },
      status: {
        optional: true,
        isIn: {
          options: [[0, 1]],
          errorMessage: POST_MESSAGES.STATUS_MUST_BE_0_OR_1
        }
      }
    },
    ['body']
  )
)
