const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await prisma.category.findMany({
        select: { id: true, name: true }
      })

      res.json({
        status: 'success',
        data: { categories }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController