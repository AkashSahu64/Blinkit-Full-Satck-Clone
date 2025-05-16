import {Router} from 'express'
import auth from '../middleware/auth.middleware.js'
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtycontroller } from '../controllers/cart.controller.js'

const cartRouter = Router()

cartRouter.post('/create', auth, addToCartItemController)
cartRouter.get('/get', auth, getCartItemController)
cartRouter.put('/update-qty', auth, updateCartItemQtycontroller)
cartRouter.delete('/delete-cart-qty', auth, deleteCartItemQtyController)
export default cartRouter