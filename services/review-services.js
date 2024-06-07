const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const reviewServices = {
  getReviewsByProductId: async (productId) => {
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

    return reviews
  },

  getReviewById: async (reviewId) => {
    const review = await prisma.review.findFirst({ where: { id: reviewId } })

    return review
  },

  createReview: async (productId, userId, comment, rating) => {
    const review = await prisma.review.create({
      data: {
        productId,
        buyerId: userId,
        comment,
        rating
      }
    })

    return review
  },

  deleteReviewById: async (reviewId) => {
    return await prisma.review.delete({ where: { id: reviewId } })
  }
}

module.exports = reviewServices