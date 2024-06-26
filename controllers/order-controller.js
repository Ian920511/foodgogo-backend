const createError = require('http-errors')

const orderServices = require('./../services/order-services')
const cartServices = require('./../services/cart-services')
const productServices = require('./../services/product-services')
const linePayService = require('./../services/linepay-services')
const paymentService = require('../services/paymentService')

const orderController = {
  getOrders : async (req, res, next) => {
    try {
      const userId = req.user.id

      const orders = await orderServices.getOrdersByUserId(userId)

      res.json({
        status: 'success',
        data: {
          orders
        }
      })

    } catch (error) {
      next(error)
    }
  },

  getOrder: async (req, res, next) => {
    try {
      const orderId = req.params.orderId

      const order = await orderServices.getOrderById(orderId)

      if (!order) {
        throw createError(404, '該訂單不存在')
      }

      res.json({
        status: 'success',
        data: {
          order
        }
      })

    } catch (error) {
      next(error)
    }
  },

  createOrder: async (req, res, next) =>{
    try {
      const { cartId } = req.user
      const userId = req.user.id
      
      const cartItems = await cartServices.getCartItemsByCartId(cartId)

      if (cartItems.length === 0) {
        throw createError(400, '購物車中沒有商品，無法成立訂單')
      }

      let totalPrice = 0
      const orderDetails = []

      const order = await orderServices.createOrder(userId, totalPrice)
      
      for (const cartItem of cartItems) {
        const product = cartItem.product

        if (!cartItem) {
          throw createError(404, '該購物車商品不存在')
        }

        if (!product.active) {
          throw createError(400, '商品目前未提供')
        }

        if (product.stock < cartItem.quantity) {
          throw createError(400, '商品庫存不足')
        }

        const updateResult = await productServices.updateProductStock(product.id, product.stock - cartItem.quantity, product.version)

        if (updateResult.count === 0) {
          throw createError(400, '商品庫存更新失敗，請重試')
        }

        totalPrice += product.price * cartItem.quantity

        const orderDetail = await orderServices.createOrderDetail(order.id, cartItem)

        orderDetails.push(orderDetail)
      }
      
      const updatedOrder = await orderServices.updateOrderTotalPrice(order.id, totalPrice)
      await cartServices.clearCartItems(cartId)

      const linePayResponse = await linePayService.createLinePayRequest(order.id, cartItems, totalPrice)
      
      if (linePayResponse?.returnCode !== '0000') {
        await orderServices.updateOrderStatus(order.id, 'CANCELLED')
        throw createError(500, 'LinePay 付款失敗')
      }

      res.json({
        status: 'success',
        message: '新增訂單成功，請前往line pay頁面完成付款',
        data: {
          order: updatedOrder,
          orderDetails,
          paymentUrl: linePayResponse.info.paymentUrl.web
        }
      })

    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  confirmLinePayPaymentHandler: async (req, res, next) => {
    try {
      const { orderId, transactionId } = req.query
      
      const newOrder = await paymentService.confirmPayment(transactionId, orderId)
  
      await orderServices.updateOrderStatus(orderId, 'PAID')
      
      res.json({
        status: 'success',
        message: '付款成功',
        data: {
          newOrder
        }
      })

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = orderController