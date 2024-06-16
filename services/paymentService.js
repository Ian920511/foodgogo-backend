const orderServices = require('./order-services');
const linePayService = require('./linepay-services');
const createError = require('http-errors');

const confirmPayment = async (transactionId, orderId) => {
  const order = await orderServices.getOrderById(orderId)
    if (!order) {
      throw createError(404, '訂單不存在')
    }

    const paymentResult = await linePayService.confirmLinePayPayment(transactionId, order.totalPrice)

    if (paymentResult.returnCode !== '0000') {
      await orderServices.updateOrderStatus(orderId, 'CANCELLED')
      throw createError(500, '付款失敗')
    }

    const newOrder = await orderServices.updateOrderStatus(orderId, 'PAID')

    return newOrder
  }

module.exports = {
  confirmPayment
}