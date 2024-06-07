const createError = require('http-errors')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const reviewServices = require('./../services/review-services')
const userServices = require('./../services/user-services')
const productServices = require('./../services/product-services')

const reviewController = {
  postReview: async (req, res, next) => {
    try {
      const { productId, comment } = req.body
      const userId = req.user.id   
      
      if (!comment) {
        throw createError(400, '必須填寫評論')
      }

      const user = await userServices.getUserById(userId)
      const product = await productServices.getProductById(productId)

      if (!user) {
        throw createError(404, '使用者不存在')
      }

      if (!product) {
        throw createError(404, '商品不存在')
      }

      const review = await reviewServices.createReview(productId, userId, comment)

      res.json({
        status: 'success',
        message: '新增評論成功',
        data: {
          review
        }
      })

    } catch (error) {
      next(error)
    }
  },

  deleteReview: async (req, res, next) => {
    try {
      const { reviewId }  = req.params

      const review = await reviewServices.getReviewById(reviewId)

      if (!review) {
        throw createError(404, '此評論不存在')
      }

      await reviewServices.deleteReviewById(reviewId)

      res.json({
        status: 'success',
        message: '刪除評論成功',
        data: {
          review
        }
      })

    } catch (error) {
      next(error)
    }
  }


}

module.exports = reviewController