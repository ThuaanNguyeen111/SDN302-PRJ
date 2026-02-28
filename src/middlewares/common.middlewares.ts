//TypeScript Generics để lọc các trường trong req.body dựa trên danh sách các key hợp lệ
import { Response, Request, NextFunction } from 'express'
import { pick } from 'lodash'
//ta đang dùng generic để khi dùng hàm filterMiddleware nó sẽ nhắc ta nên bỏ property nào vào mảng
//FilterKeys là mảng các key của object T nào đó
type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  //T là gt xem coi key hợp lệ là trường gì


    <T>(filterKey: FilterKeys<T>) =>
    (req: Request, res: Response, next: NextFunction) => {
      req.body = pick(req.body, filterKey) //pick là lấy
      next()
    }
