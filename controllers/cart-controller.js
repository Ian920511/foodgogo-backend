const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const createError = require('http-errors')

const cartServices = require('./../services/cart-services')
const productServices = require('./../services/product-services')

const cartController = {
  getCartItems : async (req, res, next) => {
    try {
      const buyerId = req.user.id

      const cart = await cartServices.getCartByUserId(buyerId)

      res.json({
        status: 'success',
        data: {
          cart
        }
      })


    } catch (error) {
      next(error)
    }
  },

  postCartItem: async (req, res, next) => {
    try {
      const { cartId } = req.user
      const { productId, quantity } = req.body

      const product = await productServices.getProductById(productId)

      let cartItem = await cartServices.getCartItem(cartId, productId)

      if (!product.active) {
        return createError(400, '商品目前未提供')
      }

      if (cartItem) {
        cartItem = await cartServices.updateCartItem(cartItem.id, quantity)
      } else {
        cartItem = await cartServices.createCartItem(cartId, productId, quantity)
      }

      res.json({
        status: 'success',
        message: '新增購物車商品成功',
        data: {
          cartItem
        }
      })

    } catch (error) {
      next(error)
    }
  },

  updateCartItem: async (req, res, next) => {
    try {
      const { quantity } = req.body
      const { cartItemId } = req.params

      const cartItem = await cartServices.getCartItemById(cartItemId)

      if (!cartItem) {
        throw createError(404, '該購物車商品不存在')
      }

      const product = await productServices.getProductById(cartItem.productId)

      if (!product.active) {
        throw createError(400, '商品目前未提供')
      }

      await cartServices.updateCartItem(cartItemId, quantity)

      res.json({
        status: 'success',
        message: '購物車商品更新成功'
      })

    } catch (error) {
      next(error)
    }
  },

  deleteCartItem : async (req, res, next) => {
    try {
      const { cartItemId } = req.params

      const cartItem = await cartServices.getCartItemById(cartItemId)

      if (!cartItem) {
        throw createError(404, '該購物車商品不存在')
      }

      await cartServices.deleteCartItem(cartItemId)

      res.json({
        status: 'success',
        message: '刪除購物車商品成功'
      })

    } catch (error) {
      next(error)
    }
  },
}

module.exports = cartController