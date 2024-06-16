const createError = require('http-errors')

const paymentService = require('../services/paymentService')
const orderServices = require('./../services/order-services')

const linePayController = {
  handleLinePay: async (req, res, next) => {
    try {
      const { transactionId, orderId } = req.body
      
      const newOrder = await paymentService.confirmPayment(transactionId, orderId)

      if (!newOrder) {
        throw createError(404, '訂單成立失敗')
      }

      await orderServices.updateOrderStatus(orderId, 'PAID')

      res.json({
        status: 'success',
        message: '付款成功',
        data: {
          order: newOrder
        }
      })

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = linePayController