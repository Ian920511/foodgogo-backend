const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()

const createError = require('http-errors')

const productController = {
  getAllProduct: async (req, res, next) => {
    try {
      const categoryId = String(req.query.categoryId) || ''
      const keyword = String(req.query.keyword) || ''
      const max = Number(req.query.max) || ''
      const orderBy = String(req.query.orderBy) || ''

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
        whereConditions.name = { contains: keyword };
      }

      if (!isNaN(max) && max !== '') {
        whereConditions.price = { lte: Number(max) };
      }

      if (categoryId && categoryId !== 'undefined') {
        whereConditions.categoryId = categoryId;
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
      const productId = req.params.productId
      
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

      const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          user: {
            select: {
              username: true
            }
          },
          comment: true,
          createdAt: true,
          id: true
        }
      })


      if (!product ){
        throw createError(404, '該商品不存在')
      }

      res.json({
        stataus: 'success',
        data: {
          product,
          reviews
        }
      })

    } catch (error) {
      next(error)
    }
  }
}

module.exports = productController