import express from 'express'
import { getMeController, loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/auth.middleware'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

import { WarpAsync } from '~/utils/handlers'

const authRouter = express.Router()

authRouter.post('/login', loginValidator, WarpAsync(loginController))
authRouter.get('/me', accessTokenValidator, WarpAsync(getMeController))

export default authRouter
