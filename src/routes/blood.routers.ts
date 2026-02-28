import { Router } from 'express'
import { UserRole } from '~/constants/enums'
import {
  deleteUnitByIdController,
  findUnitByIdController,
  getAllBloodbyNameController,
  getAllBloodController,
  inputUnitController,
  updateBloodInforController,
  updateUnitInventoryController
} from '~/controllers/bloods.controllers'
import {
  getAllBloodbyNameValidator,
  inputUnitValidator,
  updateBloodInforValidator,
  updateUnitInventoryValidator
} from '~/middlewares/bloodInventory.middleware'
import { filterMiddleware } from '~/middlewares/common.middlewares'

import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { updateBloodInventoryReqBody, updateUnitInventoryReqBody } from '~/models/request/blood.request'
import { WarpAsync } from '~/utils/handlers'

const ProductRouters = Router()
//!-------------------------------------------------------------------------------------------------|
/**
 * @description Endpoint to retrieve all blood types in the blood inventory.
 * Each blood type includes its name, total available quantity, individual units (with quantity and expiration date),
 * and its current status (EMPTY, CRITICAL, STANDARD, ENOUGH).
 *
 * @endpoint GET /inventory/bloods
 */
//!------------------------------------------------------------------|
ProductRouters.get(
  '/bloodInventory',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  WarpAsync(getAllBloodController)
)
//!------------------------------------------------------------------|

/**
 * @description Endpoint to retrieve a specific blood type record from the inventory by its name.
 * Returns detailed information about the blood type, including its total quantity,
 * list of blood units (each with quantity and expiration date), and current status
 * (EMPTY, CRITICAL, STANDARD, ENOUGH).
 *
 * @endpoint POST /inventory/bloodInventory/getBloodByName
 * @param {string} name - The name of the blood type to retrieve (e.g., A+, O-).
 */
//!--------------------------------------------------------------------------------------------------------------------|
ProductRouters.post(
  '/bloodInventory/getBloodByName',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  getAllBloodbyNameValidator,
  WarpAsync(getAllBloodbyNameController)
)
//!--------------------------------------------------------------------------------------------------------------------|

/**
 * @description Endpoint to update information of a specific blood type in the inventory.
 * Allows modification of the blood type's name, total quantity, list of blood units
 * (each with its quantity and expiration date), and the current inventory status
 * (e.g., EMPTY, CRITICAL, STANDARD, ENOUGH).
 *
 * This endpoint requires the unique ID of the blood record to identify which entry to update.
 * Fields that can be updated include: `name`, `quantity`, `units`, and `status`.
 * Only fields provided in the request body will be updated.
 *
 * @endpoint POST /updateBloodInfor
 */
//!-----------------------------------------------------------------------------------------------------|
ProductRouters.patch(
  '/bloodUpdateInfor/:blood_id',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  filterMiddleware<updateBloodInventoryReqBody>(['name', 'status']),
  updateBloodInforValidator,
  WarpAsync(updateBloodInforController)
)
//!-----------------------------------------------------------------------------------------------------|
ProductRouters.post(
  '/inputUnit',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  inputUnitValidator,
  WarpAsync(inputUnitController)
)
//!---------------------------------------------------------------------------------------------------------------|
ProductRouters.delete(
  '/deleteUnitById/:unit_id',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  WarpAsync(deleteUnitByIdController)
)
//!============================================================================================================|
ProductRouters.post(
  '/findUnitById/:unit_id',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  WarpAsync(findUnitByIdController)
)
//!----------------------------------------------------------------------------------------------------------|
ProductRouters.patch(
  '/findUnitById/:unit_id',
  accessTokenValidator,
  // requireRole(Number(UserRole.Staff)),
  filterMiddleware<updateUnitInventoryReqBody>(['quantity', 'collectionDate', 'expirationDate']),
  updateUnitInventoryValidator,
  WarpAsync(updateUnitInventoryController)
)
export default ProductRouters
