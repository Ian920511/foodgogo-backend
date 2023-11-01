const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/orders', adminController.getOrders)
router.get('/products', adminController.getProducts)
router.post('/products', adminController.createProduct)
router.put('/products/:productId', adminController.updateProduct)
router.delete('/products/:productId', adminController.deleteProduct)

module.exports = router