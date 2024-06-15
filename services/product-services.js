const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const productServices = {
  getSearchProduct: async (categoryId, keyword, max, orderBy) => {
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
        stock: true,
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
        stock: true,
        version: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return product
  },

  getAllProducts: async () => {
    const products =  await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        active: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return products
  },

  createProduct: async (name, description, imagePath, price, categoryId, stock) => {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        image: imagePath,
        price: Number(price),
        categoryId,
        stock: Number(stock)
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return product
  },

  updateProduct: async (productId, name, description, imagePath, price, categoryId, stock) => {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        image: imagePath,
        price: Number(price),
        categoryId,
        stock: Number(stock)
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return product
  },

  updateProductStatus: async (productId, active) => {
    const product = await prisma.product.update({ 
      where: { id: productId }, 
      data: { active } 
    })
    
    return product
  },

  updateProductStock: async (productId, newStock, version) => {
    const product =  await prisma.product.updateMany({
      where: {
        id: productId,
        version: version 
      },
      data: {
        stock: newStock,
        version: { increment: 1 } 
      }
    })
    
    if (product.count > 0 && newStock === 0) {
      await tx.product.update({
        where: { id: productId },
        data: { active: false }
      });
    }

    const updatedProduct = await prisma.product.findUnique({ where: { id: productId } })

    return updatedProduct
  },

  deleteProductById: async (productId) => {
    return await prisma.product.delete({ where: { id: productId } })
  }
}

module.exports = productServices