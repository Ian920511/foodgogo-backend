const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()

const createError = require('http-errors')

const productController = {
  getAllProduct: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const keyword = String(req.query.keyword) || ''
      const max = Number(req.query.max) || ''
      const orderBy = String(req.query.orderBy) || ''

      const orderByType = {
        createdAt: { createdAt: 'desc' },
        updatedAt: { updatedAt: 'desc' },
        priceDesc: { price: 'desc' },
        priceAsc: { price: 'asc' }
      }

      const filter = {
        where: {
          active: true,
          ...(keyword && { name: { contains: keyword } }),
          ...(max && { price: { lte: max } }),
          ...(categoryId && { categoryId }),
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
        },
        orderBy: orderByType[orderBy]
        }
      }

      const products = await prisma.product.findMany(filter)

      res.json({
        status: 'success',
        data: {
          products
        }
      })

    } catch (error) {
      next(error)
    }
  }, 

  getProduct: async (req, res, next) => {
    try {
      const productId = req.params.id

      const product = await prisma.product.findFirst({
        where: { id: productId },
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

      if (!product ){
        throw createError(404, '該商品不存在')
      }

      res.json({
        stataus: 'success',
        data: {
          product
        }
      })

    } catch (error) {
      next(error)
    }
  }
}

module.exports = productController