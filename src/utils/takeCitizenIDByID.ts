// import DatabaseService from '~/services/database.services'
// import { ObjectId } from 'mongodb'

// export async function findUserById(user_id: string) {
//   const objectId = new ObjectId(user_id)
//  //!chạy qua 3 bảng nếu có thì gán vào user_id
//   return (
//     (await DatabaseService.users.findOne({ _id: objectId })) ||
//     (await DatabaseService.admins.findOne({ _id: objectId })) ||
//     (await DatabaseService.staffs.findOne({ _id: objectId }))
//   )
// }

import DatabaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export async function getCitizenIDByUserId(user_id: string) {
  const objectId = new ObjectId(user_id)

  const collections = [DatabaseService.users, DatabaseService.staffs]

  for (const collection of collections) {
    const account = await collection.findOne({ _id: objectId })
    if (account?.citizen_id) {
      return account.citizen_id
    }
  }

  return null
}

export async function getUserInforByCitizenID(citizen_id: string) {
  const collections = [DatabaseService.users, DatabaseService.staffs]

  for (const collection of collections) {
    const account = await collection.findOne({ citizen_id })
    if (account) {
      console.log('Account found:', account)
      return account
    }
  }
  return null
}
