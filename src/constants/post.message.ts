export const POST_MESSAGES = {
  // title
  TITLE_IS_REQUIRED: 'Post title is required',
  TITLE_MUST_BE_A_STRING: 'Post title must be a string',
  TITLE_LENGTH_MUST_BE_FROM_1_TO_300: 'Post title length must be from 1 to 300',

  // content
  CONTENT_IS_REQUIRED: 'Post content is required',
  CONTENT_MUST_BE_A_STRING: 'Post content must be a string',

  // thumbnail
  THUMBNAIL_MUST_BE_A_STRING: 'Thumbnail must be a string',

  // suggested_products
  SUGGESTED_PRODUCTS_MUST_BE_AN_ARRAY: 'Suggested products must be an array',
  SUGGESTED_PRODUCT_ID_MUST_BE_A_STRING: 'Each suggested product ID must be a string',

  // tags
  TAGS_MUST_BE_AN_ARRAY: 'Tags must be an array',
  TAG_MUST_BE_A_STRING: 'Each tag must be a string',

  // status
  STATUS_MUST_BE_0_OR_1: 'Status must be 0 (draft) or 1 (published)',

  // CRUD
  POST_NOT_FOUND: 'Post not found',
  GET_POSTS_SUCCESS: 'Get posts successfully',
  GET_POST_DETAIL_SUCCESS: 'Get post detail successfully',
  CREATE_POST_SUCCESS: 'Create post successfully',
  UPDATE_POST_SUCCESS: 'Update post successfully',
  INVALID_POST_ID: 'Invalid post ID'
} as const
