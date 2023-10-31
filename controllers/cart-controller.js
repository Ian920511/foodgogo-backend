const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createError = require('http-errors')

const cartController = {
  getCartItems : async (req, res, next) => {
    try {
      const buyerId = req.user.id

      const cart = await prisma.cart.findFirst({
        where: { buyerId },
        select: {
          id: true,
          cartItem: {
            select: {
              id: true,
              quantity: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  active: true,
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

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

      const { productId, quantity, cartId } = req.body

      const product = await prisma.product.findFirst({
        where: { id: productId },
        select: { active: true }
      })

      let cartItem = await prisma.cartItem.findFirst({
        where: { cartId , productId },
        select: { id: true, quantity: true }
      })

      if (!product.active) {
        return createError(400, '商品目前未提供')
      }

      if (cartItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: { increment: quantity }},
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                active: true
              }
            }
          }
        })
      } else {
        cartItem = await prisma.cartItem.create({
          data: { cartId, productId, quantity },
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                active: true
              }
            }
          }
        })
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

      const cartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId },
        select: {
          id: true,
          product: { select: { id: true, active: true }}
        }
      })

      if (!cartItem) {
        throw createError(404, '該購物車商品不存在')
      }

      if (!cartItem.product.active) {
        throw createError(404, '商品目前未提供')
      }

      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: Number(quantity) },
        select: { quantity: true }
      })

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

      const cartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId },
        select: { id: true, productId: true, quantity: true }
      })

      if (!cartItem) {
        throw createError(404, '該購物車商品不存在')
      }

      await prisma.cartItem.delete({ where: { id: cartItemId }})

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