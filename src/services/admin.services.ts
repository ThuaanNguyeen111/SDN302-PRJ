import { USERS_MESSAGES } from '~/constants/message'

import { ObjectId } from 'mongodb'
import { ADMIN_MESSAGE } from '~/constants/admin.message'
import { UpdateMeReqBody } from '~/models/request/user.requests'
import DatabaseService from './database.services'
import { merge } from 'lodash'
class adminServices {
  async getAllUsers() {
    const [users, staffs, admins] = await Promise.all([
      DatabaseService.users
        .find({}, { projection: { password: 0, email_verifiy_token: 0, forgot_password: 0 } })
        .toArray(),
      DatabaseService.staffs.find({}, { projection: { password: 0 } }).toArray(),
      DatabaseService.admins.find({}, { projection: { password: 0 } }).toArray()
    ])
    const result = [...users, ...staffs, ...admins]
    if (result.length === 0) {
      throw new Error('No accounts found in the database.')
    }
    return result
  }
  //!------------------------------------------------------------------------------------------------|
  async deleteUserById(user_id: string) {
    const objectId = new ObjectId(user_id)
    const result = await DatabaseService.users.findOneAndDelete({ _id: objectId })
    if (!result) {
      throw new Error('User not found or could not be deleted.')
    }
    const result1 = await DatabaseService.RefreshTokens.findOneAndDelete({ user_id: objectId })

    if (!result1) {
      throw new Error('Refresh token not found or could not be deleted.')
    }
    return { message: ADMIN_MESSAGE.DELETE_SUCCESS }
  }
  //!------------------------------------------------------------------------------------------------|
  async getMe(user_id: string) {
    const [users, staffs, admins] = await Promise.all([
      DatabaseService.users.findOne(
        { _id: new ObjectId(user_id) },
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      ),
      DatabaseService.staffs.findOne(
        { _id: new ObjectId(user_id) },
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      ),
      DatabaseService.admins.findOne(
        { _id: new ObjectId(user_id) },
        { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
      )
    ])
    const result = users || staffs || admins

    if (!result) {
      throw new Error('User not found in any collection.')
    }

    return result
  }
  //!------------------------------------------------------------------------------------------------|

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const userObjectId = new ObjectId(user_id)
    const user = await DatabaseService.users.findOne({ _id: userObjectId })
    if (!user) throw new Error('User not found')

    // dùng merge như facility
    const updateFields: any = merge({}, user, payload, {
      updated_at: new Date()
    })

    if (payload.date_of_birth) {
      updateFields.date_of_birth = new Date(payload.date_of_birth)
    }

    const updatedUser = await DatabaseService.users.findOneAndUpdate(
      { _id: userObjectId },
      { $set: updateFields },
      {
        returnDocument: 'after',
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 }
      }
    )

    return updatedUser
  }
}
const adminServcie = new adminServices()
export default adminServcie
