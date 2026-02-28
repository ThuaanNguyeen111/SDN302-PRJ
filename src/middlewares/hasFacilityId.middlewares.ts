import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const hasFacilityId = (req: Request, res: Response, next: NextFunction) => {
  const { facility_id } = req.body

  if (!facility_id) {
    return next(
      new ErrorWithStatus({
        message: 'Missing facility_id in request body',
        status: HTTP_STATUS.BAD_REQUEST
      })
    )
  }

  next()
}
