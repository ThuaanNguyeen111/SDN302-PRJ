import DatabaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

async function getAllUser() {
  const users = await DatabaseService.users.find({})
  return users
}
