const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categoryServices = require('./../services/category-services')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await categoryServices.getAllCategories()

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