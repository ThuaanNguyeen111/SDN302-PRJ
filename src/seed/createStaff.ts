import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import DatabaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'

config()

const famousNames = [
  'Lê Thị Thu Hiền',
  'Trịnh Trần Phương Tuấn',
  'Nguyễn Thanh Tùng ',
  'Huỳnh Minh Hưng',
  'Mai Hồng Ngọc',
  'Phan Đinh Tùng',
  'Lê Ánh Nhật',
  'Mai Huyền Linh',
  'Phạm Duy Thuận',
  'Ngô Thanh Vân'
]

// Xác suất random status: 60% READY, 20% PENDING, 20% REJECTED
function getRandomStatus(): 'READY' | 'PENDING' | 'REJECTED' {
  const rand = Math.random() // taon tu random
  if (rand < 0.6) return 'READY' //0 đến 0.6
  if (rand < 0.8) return 'PENDING' //0.6 đến 0.8
  return 'REJECTED'
}

async function createMultipleStaffs() {
  try {
    await DatabaseService.connect()
    const staffs = DatabaseService.staffs

    const basePassword = hashPassword(process.env.STAFF_PASSWORD || 'demo')

    for (let i = 0; i < famousNames.length; i++) {
      const name = famousNames[i]
      const email = `staff${i + 1}@example.com`

      const existing = await staffs.findOne({ email })
      if (existing) {
        console.log(` Staff ${email} đã tồn tại.`)
        continue
      }

      const newStaff = {
        _id: new ObjectId(),
        username: `staff${i + 1}`,
        name,
        email,
        password: basePassword,
        citizen_id: `07920${i}303034`,
        created_at: new Date(),
        updated_at: new Date(),
        verify: UserVerifyStatus.Verified,
        role: UserRole.Staff,

        label: i % 3 === 0 ? 'Leader' : '',
        status: getRandomStatus()
      }

      await staffs.insertOne(newStaff)
      console.log(`Tạo staff thành công: ${name}`)
    }
  } catch (error) {
    console.error(' Lỗi tạo staff:', error)
  }
}

createMultipleStaffs()
