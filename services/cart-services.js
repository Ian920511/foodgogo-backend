const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const cartServices = {
  getCartByUserId: async (userId) => {
    const cart = await prisma.cart.findFirst({
        where: { buyerId: userId },
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
                  stock: true
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
                stock: true
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

  getCartItemsByCartId: async (cartId) => {
    const cartItems =  await prisma.cartItem.findMany({
      where: { cartId },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            active: true,
            stock: true
          }
        }
      }
    })

    return cartItems
  },

  getCartItemById: async (cartItemId) => {
    return await prisma.cartItem.findFirst({
      where: { id: cartItemId },
      select: { id: true, productId: true, quantity: true }
    })
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
            active: true,
            stock: true
          }
        }
      }
    })

    return cartItem
  },

  updateCartItem: async (cartItemId, quantity, isIncrement = false) => {
    const data = isIncrement ? { quantity: { increment: Number(quantity) } } : { quantity: Number(quantity) }

    const cartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data,
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            active: true,
            stock: true
          }
        }
      }
    })

    return cartItem
  },

  deleteCartItem: async (cartItemId) => {
    return await prisma.cartItem.delete({ where: { id: cartItemId }})
  },

  clearCartItems: async (cartId) => {
    return await prisma.cart.update({
      where: { id: cartId },
      data: {
        cartItem: { deleteMany: {} }
      }
    })
  }

}

module.exports =  cartServices