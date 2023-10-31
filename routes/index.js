const express = require('express')
const router = express.Router()

const { authValidation } = require('../middleware/validation')
const userController = require('../controllers/user-controller')

router.post('/login', authValidation, userController.login)

router.get('/', (req, res) => {
  res.send('hello world')
})

module.exports = router