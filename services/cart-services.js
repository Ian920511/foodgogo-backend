const { PrismaClient } = require('@prisma/client')
const { updateCartItem, deleteCartItem } = require('../controllers/cart-controller')
const prisma = new PrismaClient()

const cartService = {
  getCartItems: async (buyerId) => {
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
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return cart
  },

  getCartItem: async (cartId, productId) => {
    const cartItem = await prisma.cartItem.findFirst({
      where: { cartId, productId },
      select: { id: true, productId: true, quantity: true }
    })

    return cartItem
  },

  createCartItem: async (cartId, productId, quantity) => {
    const cartItem = await prisma.cartItem.create({
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

    return cartItem
  },

  updateCartItem: async (cartItemId, quantity) => {
    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: { increment: quantity } },
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

    return cartItem
  },

  deleteCartItem: async (cartItemId) => {
    return await prisma.cartItem.delete({ where: { id: cartItemId }})
  }

}

module.exports =  cartService