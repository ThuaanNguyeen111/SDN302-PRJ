import HTTP_STATUS from '~/constants/httpStatus'
import DatabaseService from './database.services'
import { ObjectId } from 'mongodb'
import { updateBloodInventoryReqBody } from '~/models/request/blood.request'
import { getCitizenIDByUserId, getUserInforByCitizenID } from '~/utils/takeCitizenIDByID'

class staffService1 {
  //!------------------------------------------------------------------------------------------|
  async getCitizenID(user_id: string) {
    const user = await getCitizenIDByUserId(user_id)
    if (!user) throw new Error('The citizenID is not exist ')

    return user
  }
  //!------------------------------------------------------------------------------------------|
  async getUserInforBYCitizenID(citizen_id: string) {
    const user = await getUserInforByCitizenID(citizen_id)
    if (!user) throw new Error('The citizenID does not exist')
    return user
  }
}
const staffService = new staffService1()
export default staffService
