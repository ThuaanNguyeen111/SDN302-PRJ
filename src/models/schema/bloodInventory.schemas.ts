import { ObjectId } from 'mongodb'
import { BloodStatus } from '~/constants/enums'

//BlooodStatus để xác định tình trạng của nhóm máu

export interface BloodUnit {
  _id?: ObjectId
  appointment_id: string
  user_id: string
  quantity?: number //tính bằng lít máu
  collectionDate?: Date
  expirationDate?: Date
}

export interface BloodType {
  _id?: ObjectId
  name: string // e.g., A, B, AB, O

  units?: BloodUnit[]
  status: BloodStatus
  created_at?: Date
  updated_at?: Date
}

export default class Blood {
  _id: ObjectId
  name: string

  units: BloodUnit[]
  status: BloodStatus
  created_at: Date
  updated_at: Date

  constructor(blood: BloodType) {
    const now = new Date()
    this._id = blood._id || new ObjectId()
    this.name = blood.name
    this.units = blood.units || []
    this.status = blood.status || BloodStatus.EMPTY
    this.created_at = blood.created_at || now
    this.updated_at = blood.updated_at || now
  }
}
