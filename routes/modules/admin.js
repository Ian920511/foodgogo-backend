const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const uploadMulter = require('../../middleware/multer')

router.get('/orders', adminController.getOrders)
router.get('/products', adminController.getProducts)
router.post('/products', uploadMulter ,adminController.createProduct)
router.put('/products/:productId', uploadMulter, adminController.updateProduct)
router.patch('/products/:productId', adminController.updateProductStatus)
router.delete('/products/:productId', adminController.deleteProduct)

module.exports = router