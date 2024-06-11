const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const  orderServices = {
  getOrdersByUserId: async (userId) => {
    const orders =  await prisma.order.findMany({
      where: { buyerId: userId },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return orders
  },

  getOrderById: async (orderId) => {
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

    return order
  },

  getOrderByAdmin: async () => {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        totalPrice: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            address: true,
            tel: true,
          }
        },
        orderDetail: {
          select: {
            id: true,
            quantity: true,
            priceAtTime: true,
            product: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    })

    return orders
  },
  
  createOrder: async (userId, totalPrice) => {
    const order = await prisma.order.create({
      data: { buyerId: userId, totalPrice }
    })

    return order
  },

  createOrderDetail: async (orderId, cartItem) => {
    const orderDetail = await prisma.orderDetail.create({
      data: {
        quantity: cartItem.quantity,
        orderId: orderId,
        priceAtTime: cartItem.product.price,
        productId: cartItem.product.id
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

    return orderDetail
  },

  updateOrderTotalPrice: async (orderId, totalPrice) => {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { totalPrice },
      select: {
        id: true,
        buyerId: true,
        totalPrice: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return order
  }

}

module.exports = orderServices