import DatabaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export async function findUserNameByID(user_id: string) {
  const objectId = new ObjectId(user_id)
  const result = await DatabaseService.users.findOne({ _id: objectId }) // ✅ thêm await

  if (!result) throw new Error('user not found')

  return result.name
}
