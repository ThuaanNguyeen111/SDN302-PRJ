// server/seed/createRoles.ts
import { config } from 'dotenv'
import { UserRole } from '~/constants/enums'
import Role from '~/models/schema/role.schemas'
import DatabaseService from '~/services/database.services'

config()

/**
 * Seed script: Tạo 4 roles mặc định (Guest, Member, Staff, Admin) vào collection roles
 * Chạy: npx ts-node -r tsconfig-paths/register src/seed/createRoles.ts
 */
async function createRoles() {
  try {
    await DatabaseService.connect()

    const rolesCollection = DatabaseService.roles

    // Kiểm tra nếu đã có dữ liệu thì không seed lại
    const existingCount = await rolesCollection.countDocuments()
    if (existingCount > 0) {
      console.log(`⚡ Đã có ${existingCount} roles trong database, bỏ qua seed.`)
      return
    }

    const rolesToInsert: Role[] = [
      new Role({
        role_name: 'Guest',
        role_code: UserRole.Guest,
        description: 'Khách chưa đăng nhập, chỉ xem được thông tin công khai'
      }),
      new Role({
        role_name: 'Member',
        role_code: UserRole.Member,
        description: 'Thành viên đã đăng ký, có thể đặt hàng và quản lý tài khoản'
      }),
      new Role({
        role_name: 'Staff',
        role_code: UserRole.Staff,
        description: 'Nhân viên, có thể quản lý sản phẩm và đơn hàng'
      }),
      new Role({
        role_name: 'Admin',
        role_code: UserRole.Admin,
        description: 'Quản trị viên, toàn quyền quản lý hệ thống'
      })
    ]

    await rolesCollection.insertMany(rolesToInsert)
    console.log('✅ Seed roles thành công! Đã tạo 4 roles: Guest, Member, Staff, Admin')
  } catch (error) {
    console.error('❌ Lỗi khi seed roles:', error)
  } finally {
    process.exit(0)
  }
}

createRoles()
