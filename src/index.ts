import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'

import { defaultErrorHandler } from './middlewares/error.middlewares'
import authRouter from './routes/auth.routers'
import usersRouters from './routes/members.routers'
import DatabaseServices from './services/database.services'
import adminRouters from './routes/admin.routers'
import ProductRouters from './routes/blood.routers'

config()

const app = express()
const port = process.env.PORT || 4000
app.use(express.json()) // middleware để parse json
// ✅ CORS phải đặt TRƯỚC tất cả các route để tránh lỗi không gọi được API từ frontend
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Support multiple frontend ports
    credentials: true // Nếu dùng cookie/session
  })
)
DatabaseServices.connect()
app.use('/auth', authRouter) // route handler cho các chức năng liên quan đến xác thực như login, refresh token, get me
app.use('/members', usersRouters) // route handler đăng kí đăng xuất
app.use('/admins', adminRouters)

//!-======= ROUTE HANDLER CHO CÁC THÀNH VIÊN CHÍNH (STAFF, ADMIN)=======-!//
app.use('/inventory', ProductRouters) // route handler kho máu
console.log('DB_USERS_COLLECTION:', process.env.DB_USERS_COLLECTION)
app.use(defaultErrorHandler)
// route handler cho các thành viên chính

app.listen(port, () => {
  console.log(`Project  này đang chạy trên post ${port}`)
})
