import { Router } from 'express'
import {
  addToCartController,
  getCartController,
  removeCartItemController,
  updateCartQuantityController
} from '~/controllers/carts.controllers'
import { accessTokenValidator, verifyfiedUserValidator } from '~/middlewares/users.middlewares'
import { WarpAsync } from '~/utils/handlers'

const cartsRouters = Router()

cartsRouters.post('/add', accessTokenValidator, verifyfiedUserValidator, WarpAsync(addToCartController))
cartsRouters.get('/', accessTokenValidator, verifyfiedUserValidator, WarpAsync(getCartController))
cartsRouters.delete(
  '/remove/:product_id',
  accessTokenValidator,
  verifyfiedUserValidator,
  WarpAsync(removeCartItemController)
)
export default cartsRouters

cartsRouters.put('/update', accessTokenValidator, verifyfiedUserValidator, WarpAsync(updateCartQuantityController))
