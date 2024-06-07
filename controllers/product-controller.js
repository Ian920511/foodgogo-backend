const { PrismaClient } = require('@prisma/client') 
const prisma = new PrismaClient()
const createError = require('http-errors')

const productServices = require('./../services/product-services')
const reviewServices = require('./../services/review-services')

const productController = {
  getAllProduct: async (req, res, next) => {
    try {
      const categoryId = String(req.query.categoryId) || ''
      const keyword = String(req.query.keyword) || ''
      const max = Number(req.query.max) || ''
      const orderBy = String(req.query.orderBy) || ''

      const products = await productServices.getSearchProduct(categoryId, keyword, max, orderBy)

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
      
      const product = await productServices.getProductById(productId)

      const reviews = await reviewServices.getReviewsByProductId(productId)

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