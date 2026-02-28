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
import Blood from '~/models/schema/bloodInventory.schemas'



config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qzi4a6o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    return this.db.collection(process.env.DB_BLOOD_COLLECTION as string)
  }
}

//------------------------------------------------------
const DatabaseService = new DatabaseServices()

export default DatabaseService
//--------------------------------------------------------
