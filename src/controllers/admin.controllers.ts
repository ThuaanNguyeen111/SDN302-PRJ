console.log('⚡ AdminController is triggered')
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core' //này copilot ko tự xổ dùng chatgpt
import { ADMIN_MESSAGE } from '~/constants/admin.message'
import { getInforByCitizenIDReqBody, UpdateMeReqBody } from '~/models/request/user.requests'
import adminServcie from '~/services/admin.services'

export const getAllUsersController = async (req: Request, res: Response) => {
  const result = await adminServcie.getAllUsers()
  return res.json(result)
}

//!----------------------------------------------------------------------------------------------------------------------------!
export const DeleteUserController = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const result = await adminServcie.deleteUserById(user_id)
  return res.json(result)
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const getMeControllerAdmin = async (req: Request, res: Response) => {
  //Muốn lấy profile thì cần access_token co user_id trong đó
  const { user_id } = req.params
  //tìm user có user_id đó
  const user = await adminServcie.getMe(user_id)
  return res.json({
    message: ADMIN_MESSAGE.GET_ME_SUCCESS,
    result: user
  })
}
//!----------------------------------------------------------------------------------------------------------------------------!
export const updateMeAdminController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  // muốn update cần user_id, và các thông tin cần update
  const { user_id } = req.params
  //khi muốn update thì nó sẽ gửi tất cả trong body
  const { body } = req
  //update lại user
  const result = await adminServcie.updateMe(user_id, body)
  return res.json({
    message: ADMIN_MESSAGE.UPDATE_ME_SUCCESS,
    result
  })
}
