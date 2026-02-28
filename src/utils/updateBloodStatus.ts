// utils/updateBloodStatus.ts

import { BloodStatus } from '~/constants/enums'

import { ObjectId } from 'mongodb'
import DatabaseService from '~/services/database.services'

interface Unit {
  quantity?: number
}

interface Blood {
  _id: ObjectId
  units: Unit[]
  status?: BloodStatus
}

export const updateBloodStatus = async (blood: Blood): Promise<BloodStatus> => {
  const totalQuantity = blood.units.reduce((sum, unit) => sum + (unit.quantity || 0), 0)

  let newStatus = BloodStatus.EMPTY
  if (totalQuantity >= 5000) newStatus = BloodStatus.HIGH
  else if (totalQuantity >= 2500) newStatus = BloodStatus.MEDIUM
  else if (totalQuantity >= 1000) newStatus = BloodStatus.LOW
  else if (totalQuantity >= 800) newStatus = BloodStatus.CRITICAL

  if (blood.status !== newStatus) {
    await DatabaseService.bloodInventory.updateOne(
      { _id: blood._id },
      {
        $set: {
          status: newStatus,
          updated_at: new Date()
        }
      }
    )
  }

  return newStatus
}
