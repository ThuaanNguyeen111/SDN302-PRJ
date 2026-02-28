console.log('⚡ StaffController is triggered')
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core' //này copilot ko tự xổ dùng chatgpt
import { getInforByCitizenIDReqBody } from '~/models/request/user.requests'
import staffService from '~/services/staff.services'

//!----------------------------------------------------------------------------------------------------------------------------!
export const getCitizenIDController = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const result = await staffService.getCitizenID(user_id)
  return res.json(result)
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const getUserInforBYCitizenIController = async (
  req: Request<ParamsDictionary, any, getInforByCitizenIDReqBody>,
  res: Response
) => {
  const { citizen_id } = req.body
  const result = await staffService.getUserInforBYCitizenID(citizen_id)
  return res.json(result)
}
//!----------------------------------------------------------------------------------------------------------------------------!
