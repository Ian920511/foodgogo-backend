const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/cart-controller')

router.patch('/:cartItemId', cartController.updateCartItem)
router.delete('/:cartItemId', cartController.deleteCartItem)

router.get('/', cartController.getCartItems)
router.post('/', cartController.postCartItem)

module.exports = router