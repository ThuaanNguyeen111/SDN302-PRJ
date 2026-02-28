import { omit } from 'lodash'
import express, { Response, NextFunction, Request } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  //di qua từng thuộc tính (vd: 'stack', 'message','loi','blablabla'). enumerable là de tinh duoc
  //enumerable = true để các thuộc tính của err có thể xuất hiện trong JSON/log,
  // các lỗi trả ra như lỗi đều là Object, nên cần phải làm cho các thuộc tính của nó có thể được liệt kê
  //get
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  //? nếu lỗi xuống dược đây
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack']) 
  })
}
