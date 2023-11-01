const express = require('express')
const router = express.Router()

const { authValidation } = require('../middleware/validation')
const userController = require('../controllers/user-controller')
const categoryController = require('../controllers/category-controller')
const carts = require('./modules/carts')
const products = require('./modules/products')

router.post('/login', authValidation('login'), userController.login)
router.post('/register', authValidation('register'), userController.register)

router.get('/categories', categoryController.getCategories)

router.use('/carts', authValidation, carts)
router.use('/products', products)

router.get('/', (req, res) => {
  res.send('hello world')
})

module.exports = router