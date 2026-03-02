import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PRODUCT_MESSAGES } from '~/constants/product.message'
import { CreateProductReqBody, UpdateProductReqBody } from '~/models/request/product.request'
import productService from '~/services/products.services'

//!------------------------------------------------------------------------------------------------|
/**
 * GET /api/products
 * Lấy danh sách tất cả sản phẩm (Guest có thể xem)
 */
export const getAllProductsController = async (req: Request, res: Response) => {
  const result = await productService.getAllProducts()
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * GET /api/products/:id
 * Xem chi tiết 1 sản phẩm (Guest có thể xem)
 */
export const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await productService.getProductById(id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_DETAIL_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * POST /api/products
 * (Staff/Admin) Thêm sản phẩm mới
 */
export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response
) => {
  const result = await productService.createProduct(req.body)
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * PUT /api/products/:id
 * (Staff/Admin) Cập nhật thông tin, số lượng tồn kho
 */
export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductReqBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await productService.updateProduct(id, req.body)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    result
  })
}

//!------------------------------------------------------------------------------------------------|
/**
 * DELETE /api/products/:id
 * (Admin) Xóa sản phẩm
 */
export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await productService.deleteProduct(id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    result
  })
}
