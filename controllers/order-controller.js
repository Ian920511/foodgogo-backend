const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createError = require('http-errors')

const orderController = {
  getOrders : async (req, res, next) => {
    try {
      const userId = req.user.id

      const orders = await prisma.order.findMany({
        where: { buyerId: userId },
        select: {
          id: true,
          totalPrice: true,
          orderDetail: {
            select: {
              id: true,
              priceAtTime: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      })

      res.json({
        status: 'success',
        data: {
          orders
        }
      })

    } catch (error) {
      next(error)
    }
  },

  getOrder: async (req, res, next) => {
    try {
      const orderId = req.params.id

      const order = await prisma.order.findFirst({
        where: { id: orderId },
        select: {
          id: true,
          totalPrice: true,
          orderDetail: {
            select: {
              id: true,
              priceAtTime: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      })

      if (!order) {
        throw createError(404, '該訂單不存在')
      }

      res.json({
        status: 'success',
        data: {
          order
        }
      })


    } catch (error) {
      next(error)
    }
  },

  createOrder: async (req, res, next) =>{
    try {
      const { cartId } = req.user
      const userId = req.user.id

      const cartItems = await prisma.cartItem.findMany({
        where: { cartId },
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

      let totalPrice = 0
      const orderDetails = []

      const order = await prisma.order.create({
        data: { buyerId: userId, totalPrice}
      })

      for (const cartItem of cartItems) {
        const product = cartItem.product

        if (!cartItem) {
          throw createError(404, '該購物車商品不存在')
        }

        if (!product.active) {
          throw createError(400, '商品目前未提供')
        }

        totalPrice += product.price * cartItem.quantity

        const orderDetail = await prisma.orderDetail.create({
          data: { 
            quantity: cartItem.quantity,
            orderId: order.id,
            priceAtTime: product.price,
            productId: product.id
          },
          select: {
            id: true,
            quantity: true,
            priceAtTime: true,
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })

        orderDetails.push(orderDetail)
      }

      await prisma.order.update({
          where: { id: order.id },
          data: { totalPrice }
        })

      await prisma.cart.update({
        where: { id: cartId },
        data: {
          cartItem: { deleteMany: {}}
        }
      })

      res.json({
        status: 'success',
        message: '新增訂單成功',
        data: {
          order,
          orderDetails
        }
      })

    } catch (error) {
      next(error)
    }
  },
}

module.exports = orderController