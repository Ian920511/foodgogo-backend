const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const reviewController = {
  postReview: async (req, res, next) => {
    try {
      const { productId, comment, rating } = req.body
      const userId = req.user.id

      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw createError(400, '評分需在1到5之間，且為數字');
      }

      if (!comment) {
        throw createError(400, '必須填寫評論')
      }

      const user = await prisma.user.findFirst({ where: { id: userId }})
      const product = await prisma.product.findFirst({ where: { id: productId }})

      if (!user) {
        throw createError(404, '使用者不存在')
      }

      if (!product) {
        throw createError(404, '商品不存在')
      }

      const review = await prisma.review.create({
        data: {
          productId,
          buyerId: userId,
          comment,
          rating
        }
      })

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
    const { reviewId }  = req.params

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId
      }
    })

    if (!review) {
      throw createError(404, '此評論不存在')
    } else {
      await prisma.review.delete({
        where: {
          id: reviewId
        }
      })
    }

    res.json({
      status: 'success',
      message: '刪除評論成功'
    })
  }


}

module.exports = reviewController