import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb'
//!======================================================================
//* cài dotent  là file cài biến môi trường cho code
// sử dụng bằng các như dưới

//! Cách xài .env
import { config } from 'dotenv'
import User from '~/models/schema/users.schemas'
import RefreshToken from '~/models/schema/refreshToken.schemas'
import Admin from '~/models/schema/admin.schemas'
import Staff from '~/models/schema/staff.schemas'

import Order from '~/models/schema/order.schemas'

import Blood from '~/models/schema/bloodInventory.schemas'
import Product from '~/models/schema/product.schemas'
import Post from '~/models/schema/post.schemas'
import Role from '~/models/schema/role.schemas'
import Reward from '~/models/schema/reward.schemas'
import PointHistory from '~/models/schema/pointHistory.schemas'
import Report from '~/models/schema/report.schemas'

config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sdn-project.u8hm9wu.mongodb.net/?appName=SDN-project`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseServices {
  private client: MongoClient
  private db: Db //? Db thuộc vào mongodb nên phải import
  Blood: any

  constructor() {
    this.client = new MongoClient(uri)
    //? gán this db cho để không lập code chỉ cần this.db cho gọn
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      //! throw lỗi để sau này tập kết tất cả các lỗi để xử lý
      throw error
    }
  }

  //!------------------------------------------------------------------------------------------------

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get hospitals(): Collection<any> {
    return this.db.collection(process.env.DB_HOSPITAL_COLLECTION as string)
  }

  //TODO-HÀM GỌI refresh TOKEN NẾU CẦN
  get RefreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get admins(): Collection<Admin> {
    return this.db.collection(process.env.DB_ADMINS_COLLECTION as string)
  }
  get staffs(): Collection<Staff> {
    return this.db.collection(process.env.DB_STAFFS_COLLECTION as string)
  }
  get bloodInventory(): Collection<Blood> {
    return this.db.collection(process.env.DB_BLOOD_INVENTORY_COLLECTION as string)
  }

  get orders(): Collection<Order> {
    return this.db.collection(process.env.DB_ORDERS_COLLECTION as string)
  }
  get vouchers(): Collection<any> {
    // Bạn có thể tự định nghĩa class Voucher sau
    return this.db.collection(process.env.DB_VOUCHERS_COLLECTION as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_PRODUCTS_COLLECTION || 'products')
  }

  get posts(): Collection<Post> {
    return this.db.collection(process.env.DB_POSTS_COLLECTION || 'posts')
  }

  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLES_COLLECTION as string || 'roles')
  }

  get rewards(): Collection<Reward> {
    return this.db.collection(process.env.DB_REWARDS_COLLECTION || 'rewards')
  }

  get pointHistories(): Collection<PointHistory> {
    return this.db.collection(process.env.DB_POINT_HISTORIES_COLLECTION || 'point_histories')
  }

  get reports(): Collection<Report> {
    return this.db.collection(process.env.DB_REPORTS_COLLECTION || 'reports')
  }
}

//------------------------------------------------------
const DatabaseService = new DatabaseServices()

export default DatabaseService
//--------------------------------------------------------
