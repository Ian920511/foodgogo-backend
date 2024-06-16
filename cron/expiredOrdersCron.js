const cron = require('node-cron');
const orderServices = require('./../services/order-services');
const productServices = require('./../services/product-services')

cron.schedule('*/10 * * * *', async () => {
  console.log('Checking for expired orders...')

  try {
    const expiredOrders = await orderServices.getExpiredPendingOrders()

    for (const order of expiredOrders) {
      await orderServices.updateOrderStatus(order.id, 'CANCELLED')
      
     for (const detail of order.orderDetail) {
        const product = await productServices.getProductById(detail.productId)

        if(!product) {
          console.error(`此商品 ${product.id}不存在`)
          continue
        }

        const newStock = product.stock + detail.quantity  
        const version = product.version
        const updateResult = await productServices.updateProductStock(product.id, newStock, version)
        
        console.lof(`此${order.id} 訂單更新完成`)

        if (updateResult.count === 0) {
          console.error(`物品更新失敗`)
        }
      }
    }
  } catch (error) {
    console.error('Error checking for expired orders:', error)
  }
})