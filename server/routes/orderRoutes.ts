import express from 'express'
import auth from '../middleware/auth.js'
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrderStatus } from '../controllers/orderController.js'
import admin from '../middleware/admin.js'
const orderRouter = express.Router()
orderRouter.post('/',  createOrder)
orderRouter.get('/',  getUserOrders)
orderRouter.get('/all',  admin, getAllOrders)
orderRouter.get('/:id',  getOrder)
orderRouter.put('/:id/status',  admin, updateOrderStatus)
orderRouter.get('/:id/location',  getOrderLocation)

export default orderRouter