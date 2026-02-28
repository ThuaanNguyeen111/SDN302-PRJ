import { ObjectId } from 'mongodb'
import DatabaseService from '~/services/database.services'

export async function getBloodIdFromInventory(blood_id: string) {
  const objectBloodId = new ObjectId(blood_id)
  const result = await DatabaseService.bloodInventory.findOne({ _id: objectBloodId })
  return result
}

export default getBloodIdFromInventory
