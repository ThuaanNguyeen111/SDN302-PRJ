// server/seed/createAdmin.ts
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { UserRole, UserVerifyStatus } from '~/constants/enums'
import DatabaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'

config()

async function createAdmin() {
  try {
    // Kết nối database
    await DatabaseService.connect()

    // Truy cập vào collection admins
    const admins = DatabaseService.admins

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await admins.findOne({ email: process.env.ADMIN_EMAIL! })
    if (existingAdmin) {
      console.log(' Admin user đã tồn tại.')
      return
    }

    // Mã hoá mật khẩu
    const password = hashPassword(process.env.ADMIN_PASSWORD!)

    // Tạo đối tượng admin mới
    const newAdmin = {
      _id: new ObjectId(),
      username: 'admin',
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL!,
      password,
      created_at: new Date(),
      updated_at: new Date(),
      verify: UserVerifyStatus.Verified,
      role: UserRole.Admin
    }

    // Thêm admin vào collection
    await admins.insertOne(newAdmin)
    console.log(' Tạo admin thành công.')
  } catch (error) {
    console.error(' Lỗi khi tạo admin:', error)
  }
}

createAdmin()
