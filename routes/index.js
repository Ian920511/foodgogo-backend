const express = require('express')
const router = express.Router()

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { authValidation } = require('../middleware/validation')
const userController = require('../controllers/user-controller')
const categoryController = require('../controllers/category-controller')
const carts = require('./modules/carts')
const products = require('./modules/products')
const orders = require('./modules/orders')
const admin = require('./modules/admin')

router.post('/login', authValidation('login'), userController.login)
router.post('/register', authValidation('register'), userController.register)

router.get('/categories', categoryController.getCategories)

router.use('/admin', authenticatedAdmin, admin)
router.use('/carts', authenticated, carts)
router.use('/orders', authenticated, orders)
router.use('/products', products)

router.get('/', (req, res) => {
  res.send('hello world')
})

module.exports = router