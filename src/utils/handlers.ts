//! ERROR FUNCTION
//! công dụng của warpAsync là để bắt lỗi cho các hàm async bên trong
//---------------------------------------------------------------------------------------------------------------------
import { RequestHandler, NextFunction, Response, Request } from 'express'

//! Nhận vào function và có RequestHandler
//! <p> nghĩa là nó nhận vào 1 function và trả về 1 function

export const WarpAsync = <P>(fn: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      //? Bởi vì bản thân hàm được sử dụng sử dụng async (cơ bản nó là 1 promise) mà async
      //* throw thì reject , return thì resolve
      // nên nếu sử dụng await ở đây thì hàm bọc nó phải async
      await fn(req, res, next) // Gọi hàm controller, nếu bị lỗi sẽ nhảy xuống catch
    } catch (error) {
      next(error) // Gửi lỗi về middleware xử lý lỗi của Express
    }
  }
}
