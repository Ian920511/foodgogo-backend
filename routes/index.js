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
router.get('/get_current_user', authenticated, userController.getCurrentUser)
router.post('/favorite/:productId', authenticated, userController.addFavorite)
router.delete('/favorite/:productId', authenticated, userController.removeFavorite)


router.get('/categories', categoryController.getCategories)

router.use('/admin', authenticated ,authenticatedAdmin, admin)
router.use('/carts', authenticated, carts)
router.use('/orders', authenticated, orders)
router.use('/products', products)

router.get('/', (req, res) => {
  res.send('hello world')
})

module.exports = router