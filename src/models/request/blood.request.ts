import { BloodUnit } from '../schema/bloodInventory.schemas'

export interface CreateBloodReqBody {
  name: string
}

export interface updateBloodInventoryReqBody {
  name: string
  status: string
}
export interface updateUnitInventoryReqBody {
  quantity: number
  collectionDate: Date
  expirationDate: Date
}
export interface InputUnitReqBody {
  name: string
  units: BloodUnit[]
}
export interface DeleteUnitReqBody {
  _id: string
}
export interface FindUnitReqBody {
  _id: string
}
