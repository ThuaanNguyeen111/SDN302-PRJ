import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

import { EntityError, ErrorWithStatus } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //* Vì không phải mảng nên bỏ vòng lặp và 's' ở cuối validation
    await validation.run(req) //! Chạy qua từng validation và kiểm tra lỗi

    const errors = validationResult(req) //* Lấy và in ra lỗi nếu có
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} }) // tạo 1 mảng trống chứa các lỗi sai

    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }
      entityError.errors[key] = msg //Dòng này gom toàn bộ các lỗi 422 lại thành một object
    } 
    //? Xử lý lỗi luôn, không ném về errorHandler tổng
    next(entityError)
  }
}
