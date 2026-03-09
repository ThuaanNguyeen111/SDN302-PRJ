import DatabaseService from './database.services'

class DashboardService {
  async getStats() {
    // 1. Đếm tổng số lượng khách hàng (Member)
    const totalUsers = await DatabaseService.users.countDocuments()

    // 2. Đếm tổng số lượng đơn hàng trên hệ thống
    const totalOrders = await DatabaseService.orders.countDocuments()

    // 3. Tính tổng doanh thu (Chỉ cộng tiền các đơn có status là 'Delivered' hoặc 'Paid')
    const revenueResult = await DatabaseService.orders
      .aggregate([
        {
          $match: {
            status: { $in: ['Delivered', 'Paid', 'Success'] } // Lọc ra các đơn thành công
          }
        },
        {
          $group: {
            _id: null, // Gom nhóm tất cả lại làm 1
            totalRevenue: { $sum: '$final_amount' } // Cộng dồn trường final_amount
          }
        }
      ])
      .toArray()

    // Nếu chưa có đơn hàng nào thành công, mảng rỗng thì gán doanh thu = 0
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0

    return {
      total_users: totalUsers,
      total_orders: totalOrders,
      total_revenue: totalRevenue
    }
  }
}

const dashboardService = new DashboardService()
export default dashboardService
