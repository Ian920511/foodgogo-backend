const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const favoriteServices = {
  getFavoritesByUserId: async (userId) => {
    const favorite = await prisma.favorite.findFirst({
      where: { buyerId: userId }
    })

    return favorite
  },

  getFavoriteByUserIdAndProductId: async (userId, productId) => {
    const favorite = await prisma.favorite.findFirst({
      where: {
        buyerId: userId,
        productId
      }
    })

    return favorite
  },

  createFavorite: async (userId, productId) => {
    const favorite = await prisma.favorite.create({
      data: {
        buyerId: userId,
        productId,
      },
      select: {
        id: true,
        buyerId: true,
        productId: true,
        product: true
      }
    })

    return favorite
  },

  deleteFavoriteById: async (favoriteId) => {
    return await prisma.favorite.delete({
      where: { id: favoriteId }
    })
  }
}

module.exports = favoriteServices