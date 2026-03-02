import { ObjectId } from 'mongodb'
import DatabaseService from './database.services'
import Product from '~/models/schema/product.schemas'
import { CreateProductReqBody, UpdateProductReqBody } from '~/models/request/product.request'
import { PRODUCT_MESSAGES } from '~/constants/product.message'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

class ProductService {
  //!------------------------------------------------------------------------------------------------|
  async getAllProducts() {
    const products = await DatabaseService.products.find().toArray()
    return products
  }

  //!------------------------------------------------------------------------------------------------|
  async getProductById(product_id: string) {
    if (!ObjectId.isValid(product_id)) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const product = await DatabaseService.products.findOne({ _id: new ObjectId(product_id) })

    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return product
  }

  //!------------------------------------------------------------------------------------------------|
  async createProduct(payload: CreateProductReqBody) {
    const product = new Product({
      ...payload,
      price: Number(payload.price),
      stock_quantity: Number(payload.stock_quantity)
    })

    await DatabaseService.products.insertOne(product)

    return product
  }

  //!------------------------------------------------------------------------------------------------|
  async updateProduct(product_id: string, payload: UpdateProductReqBody) {
    if (!ObjectId.isValid(product_id)) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Chỉ set những field có trong payload
    const updateFields: Record<string, unknown> = {}
    if (payload.name !== undefined) updateFields.name = payload.name
    if (payload.description !== undefined) updateFields.description = payload.description
    if (payload.category !== undefined) updateFields.category = payload.category
    if (payload.price !== undefined) updateFields.price = Number(payload.price)
    if (payload.stock_quantity !== undefined) updateFields.stock_quantity = Number(payload.stock_quantity)
    if (payload.image_url !== undefined) updateFields.image_url = payload.image_url
    if (payload.brand !== undefined) updateFields.brand = payload.brand
    if (payload.age_range !== undefined) updateFields.age_range = payload.age_range

    const result = await DatabaseService.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      {
        $set: {
          ...updateFields,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }

  //!------------------------------------------------------------------------------------------------|
  async deleteProduct(product_id: string) {
    if (!ObjectId.isValid(product_id)) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.INVALID_PRODUCT_ID,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const result = await DatabaseService.products.findOneAndDelete({ _id: new ObjectId(product_id) })

    if (!result) {
      throw new ErrorWithStatus({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return result
  }
}

const productService = new ProductService()
export default productService
