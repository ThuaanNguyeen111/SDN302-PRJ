export const PRODUCT_MESSAGES = {
  // name
  NAME_IS_REQUIRED: 'Product name is required',
  NAME_MUST_BE_A_STRING: 'Product name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_200: 'Product name length must be from 1 to 200',
  ALLOW_PREORDER_MUST_BE_BOOLEAN: 'Allow preorder must be a boolean',
  // description
  DESCRIPTION_MUST_BE_A_STRING: 'Description must be a string',

  // category
  CATEGORY_MUST_BE_A_STRING: 'Category must be a string',

  // price
  PRICE_IS_REQUIRED: 'Price is required',
  PRICE_MUST_BE_A_NUMBER: 'Price must be a number',
  PRICE_MUST_BE_POSITIVE: 'Price must be greater than 0',

  // stock_quantity
  STOCK_QUANTITY_IS_REQUIRED: 'Stock quantity is required',
  STOCK_QUANTITY_MUST_BE_A_NUMBER: 'Stock quantity must be a number',
  STOCK_QUANTITY_MUST_BE_NON_NEGATIVE: 'Stock quantity must be 0 or greater',

  // image_url
  IMAGE_URL_MUST_BE_A_STRING: 'Image URL must be a string',

  // brand
  BRAND_MUST_BE_A_STRING: 'Brand must be a string',

  // age_range
  AGE_RANGE_MUST_BE_A_STRING: 'Age range must be a string',

  // CRUD
  PRODUCT_NOT_FOUND: 'Product not found',
  GET_PRODUCTS_SUCCESS: 'Get products successfully',
  GET_PRODUCT_DETAIL_SUCCESS: 'Get product detail successfully',
  CREATE_PRODUCT_SUCCESS: 'Create product successfully',
  UPDATE_PRODUCT_SUCCESS: 'Update product successfully',
  DELETE_PRODUCT_SUCCESS: 'Delete product successfully',
  INVALID_PRODUCT_ID: 'Invalid product ID'
} as const
