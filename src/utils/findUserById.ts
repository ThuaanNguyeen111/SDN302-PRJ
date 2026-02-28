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

export async function findUserById(user_id: string) {
  const objectId = new ObjectId(user_id)

  const collections = [
    { collection: DatabaseService.users },
    { collection: DatabaseService.admins },
    { collection: DatabaseService.staffs },
  
  ]

  for (const { collection } of collections) {
    const account = await collection.findOne({ _id: objectId })
    if (account) return { ...account, role: account.role }
  }

  return null
}
