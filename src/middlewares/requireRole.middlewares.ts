import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

export const requireRole = (...permission: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user || !permission.includes(user.user_role)) {
      throw new ErrorWithStatus({
        message: 'Forbidden: You do not have permission to access this resource',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    next()
  }
}
