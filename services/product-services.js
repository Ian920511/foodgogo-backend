const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const productServices = {
  getAllProduct: async (categoryId, keyword, max, orderBy) => {
    const orderByType = {
      createdAt: { createdAt: 'desc' },
      updatedAt: { updatedAt: 'desc' },
      priceDesc: { price: 'desc' },
      priceAsc: { price: 'asc' }
    }

    const whereConditions = {
        active: true
      }

    if (keyword && keyword !== 'undefined') {
      whereConditions.name = { contains: keyword }
    }

    if (!isNaN(max) && max !== '') {
      whereConditions.price = { lte: Number(max) }
    }

    if (categoryId && categoryId !== 'undefined') {
      whereConditions.categoryId = categoryId
    }

    const filter = {
      where: whereConditions,
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        active: true,
        category: {
          select: {
            id: true,
            name: true
          }  
        }
      },
      orderBy: orderByType[orderBy]
    }

    const products = await prisma.product.findMany(filter)

    return products
  },

  getProductById: async (productId) => {
    const product = await prisma.product.findFirst({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        active: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return product
  }
}

module.exports = productServices