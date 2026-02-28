import DatabaseService from './database.services'
import { ObjectId } from 'mongodb'
import { updateBloodInventoryReqBody, updateUnitInventoryReqBody } from '~/models/request/blood.request'
import { BloodType, BloodUnit } from '~/models/schema/bloodInventory.schemas'
import { updateBloodStatus } from '~/utils/updateBloodStatus'

class bloodService1 {
  async getAllBloods() {
    const bloods = await DatabaseService.bloodInventory.find().toArray()
    if (bloods.length === 0) {
      throw new Error('No blood types found in the inventory.')
    }
    return bloods
  }
  //!------------------------------------------------------------------------------------------------|
  async getAllBloodsByName(blood_name: string) {
    const blood = await DatabaseService.bloodInventory.findOne({ name: blood_name })

    if (!blood) {
      throw new Error('Blood type not found.')
    }

    // 🧠 Gọi utils để cập nhật status nếu cần
    const newStatus = await updateBloodStatus(blood)
    blood.status = newStatus

    return blood
  }
  //!----------------------------------------------------------------------------------------------------------|
  async updateBloodInfor(blood_id: string, payload: updateBloodInventoryReqBody) {
    const objectId = new ObjectId(blood_id)
    const __payload = payload
    const result = await DatabaseService.bloodInventory.findOneAndUpdate(
      { _id: objectId },
      //? đóng [ ] là để sử dụng
      [
        {
          $set: {
            ...__payload,
            updated_at: `$$NOW`
          }
        }
      ],
      { returnDocument: 'after' }
    )

    return result
  }
  //!---------------------------------------------------------------------------------------------------------------!
  //! xem lại hàm này
  async addUnit(name: string, units: BloodUnit[]) {
    const bloodCollection = DatabaseService.bloodInventory
    //tạo 1 phần tử là addUnitid chạy qua từng phần tử bên trong body
    //phân ra
    const addUnitId = units.map((unit) => {
      const { _id, ...rest } = unit
      return {
        _id: _id && ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId(), // nếu có _id thì chuyển sang ObjectId, nếu không thì tạo mới
        ...rest
      }
    })
    const result = await bloodCollection.findOneAndUpdate(
      { name },
      {
        $push: {
          units: {
            $each: addUnitId
          }
        },
        $set: {
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' } // để lấy bản ghi mới sau update
    )
    if (!result) {
      throw new Error('BLOOD_TYPE_NOT_FOUND')
    }
    return result
  }
  //!-----------------------------------------------------------------------------------------------|
  async deleteUnitById(unit_id: string, bloodTypeId: string) {
    const result = await DatabaseService.bloodInventory.updateOne(
      { _id: new ObjectId(bloodTypeId) },
      {
        $pull: {
          units: { _id: new ObjectId(unit_id) }
        },
        $set: {
          updated_at: new Date()
        }
      }
    )
    //modifiedCount,matchedCount chỉ có ở những hàm updateOne(), updateMany(), deleteOne() mới trả về
    if (result.modifiedCount === 0) {
      throw new Error('Blood unit not found')
    }

    return result
  }
  //!-------------------------------------------------------------------------------------------------------------|
  async FindUnitById(unit_id: string, bloodTypeId: string) {
    const result = DatabaseService.bloodInventory.findOne(
      {
        _id: new ObjectId(bloodTypeId),
        'units._id': new ObjectId(unit_id)
      },
      {
        projection: {
          name: 1,
          'units.$': 1
        }
      }
    )
    if (!result) {
      throw new Error('Blood unit not found')
    }

    return result
  }
  //!====================================================================================================================|
  async updateUnitInventory(unit_id: string, payload: updateUnitInventoryReqBody) {
    //Khởi tạo updateField là 1 object rỗng có key là string và value là gì cũng được
    //khác Facility bên này lồng nhiều object vào nhau
    const updateFields: Record<string, unknown> = {}
    console.log(payload)

    //NẾU CÓ UPDATE GÌ MỚI THÌ THÊM VÀO UPDATEFIELD
    //! units.$.quantity là cách viết của MongoDB để chỉ update phần tử đầu tiên trong mảng units khớp với điều kiện
    //TODO $ là positional operator, dùng khi mảng có nhiều phần tử và muốn cập nhật đúng phần tử khớp.
    if (payload.quantity !== undefined) updateFields['units.$.quantity'] = payload.quantity
    if (payload.collectionDate !== undefined) updateFields['units.$.collectionDate'] = new Date(payload.collectionDate)
    if (payload.expirationDate !== undefined) updateFields['units.$.expirationDate'] = new Date(payload.expirationDate)

    console.log('unitId:', unit_id)

    // Cập nhật unit
    const result = await DatabaseService.bloodInventory.findOneAndUpdate(
      {
        'units._id': new ObjectId(unit_id)
      },
      {
        $set: updateFields,
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' } // lấy document mới sau update
    )

    //không tìm thấy thì return
    if (!result) return null

    const updatedStatus = await updateBloodStatus(result)
    result.status = updatedStatus

    return result
  }
}
const bloodService = new bloodService1()
export default bloodService
