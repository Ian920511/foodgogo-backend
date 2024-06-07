const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categoryServices = {
  getAllCategories: async () => {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    })

    return categories
  }
}

module.exports = categoryServices