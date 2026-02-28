import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import bloodService from '~/services/bloods.services'
import DatabaseService from '~/services/database.services'
import { Request, Response } from 'express'
import {
  CreateBloodReqBody,
  DeleteUnitReqBody,
  FindUnitReqBody,
  InputUnitReqBody,
  updateBloodInventoryReqBody,
  updateUnitInventoryReqBody
} from '~/models/request/blood.request'
import { BLOOD_INVENTORY_MESSAGES } from '~/constants/bloodInventory'
import { ObjectId } from 'mongodb'
import { updateBloodStatus } from '~/utils/updateBloodStatus'

//!------------------------------------------------------------------------------------------------|
export const getAllBloodController = async (req: Request, res: Response) => {
  const result = await bloodService.getAllBloods()
  return res.json(result)
}
//!------------------------------------------------------------------------------------------------|
export const getAllBloodbyNameController = async (
  req: Request<ParamsDictionary, any, CreateBloodReqBody>,
  res: Response
) => {
  const { name } = req.body
  const result = await bloodService.getAllBloodsByName(name)
  return res.json(result)
}
//!------------------------------------------------------------------------------------------------|
export const updateBloodInforController = async (
  req: Request<ParamsDictionary, any, updateBloodInventoryReqBody>,
  res: Response
) => {
  const { blood_id } = req.params
  const { body } = req
  const result = await bloodService.updateBloodInfor(blood_id, body)
  return res.json(result)
}

//!---------------------------------------------------------------------------------------------------!
export const inputUnitController = async (req: Request<ParamsDictionary, any, InputUnitReqBody>, res: Response) => {
  const { name, units } = req.body

  const result = await bloodService.addUnit(name, units)
  const newStatus = await updateBloodStatus(result)
  return res.json({
    message: BLOOD_INVENTORY_MESSAGES.ADD_UNIT_SUCCESSFULLY,
    bloodType: result.name,
    status: newStatus
  })
}
//!_-----------------------------------------------------------------------------------------------------|

export const deleteUnitByIdController = async (
  req: Request<ParamsDictionary, any, DeleteUnitReqBody>,
  res: Response
) => {
  const { unit_id } = req.params // ID của unit cần xóa
  const { _id: bloodTypeId } = req.body // ID của nhóm máu chứa unit đó

  await bloodService.deleteUnitById(unit_id, bloodTypeId)

  return res.json({ message: BLOOD_INVENTORY_MESSAGES.DELETE_UNIT_SUCCESSFULLY })
}
//!_-----------------------------------------------------------------------------------------------------------|
export const findUnitByIdController = async (req: Request<ParamsDictionary, any, FindUnitReqBody>, res: Response) => {
  const { unit_id } = req.params // ID của unit cần xóa
  const { _id: bloodTypeId } = req.body // ID của nhóm máu chứa unit đó

  const result = await bloodService.FindUnitById(unit_id, bloodTypeId)

  return res.json(result)
}
//!-----------------------------------------------------------------------------------------------------------------|
export const updateUnitInventoryController = async (
  req: Request<ParamsDictionary, any, updateUnitInventoryReqBody>,
  res: Response
) => {
  const { unit_id } = req.params
  const { body } = req
  const result = await bloodService.updateUnitInventory(unit_id, body)
  return res.json(result)
}
