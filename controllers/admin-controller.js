const createError = require('http-errors')

const productServices = require('./../services/product-services')
const orderServices = require('./../services/order-services')

const adminController = {
  getProducts: async (req, res, next) => {
    try {
    const products = await productServices.getAllProducts()

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

  createProduct: async (req, res, next) => {
    try {
      const { name, description, price, categoryId } = req.body
      const { file } = req

      const product = await productServices.createProduct(name, description, file.path, price, categoryId)

      res.json({
        status: 'success',
        message: '商品新增成功',
        data: {
          product
        }
      })

    } catch (error) {
      console.log(error)
      next(error)
    }

  },

  updateProduct: async (req, res, next) => {
    try {
      const productId = req.params.productId
      const { file } = req
      const { name, description, price, categoryId } = req.body
      
      const product = await productServices.getProductById(productId)
   
      if (!product) {
        throw createError(404, '該商品不存在')
      }

      const updateProduct = await productServices.updateProduct(productId, name, description, file ? file.path : product.image, price, categoryId)

      res.json({
        status: 'success',
        message: '商品更新完成',
        data: {
          product: updateProduct
        }
      })

    } catch (error) {
      next(error)
    }
  },

  updateProductStatus: async (req, res, next) => {
    try {
      const { productId } = req.params
      const active = req.query.active !== 'false'

      const updateProduct = await productServices.updateProductStatus(productId, active)

      res.json({
        status: 'success',
        message: '商品狀態更新成功',
        data: {
          product: updateProduct
        }
      })
    } catch (error) {
      next(error)
    }
  },


  deleteProduct: async (req, res, next) => {
    try {
      const { productId } = req.params
      const product = await prisma.product.findFirst({ where:{ id: productId }})
      
      if (!product) {
        throw createError(404, '該商品不存在')
      }

      if (product.active) {
        throw createError(400, '商品需下架後，才能進行刪除')
      }

      await deleteProductById(productId)

      res.json({
        status: 'success',
        message: '商品刪除完成'
      })

    } catch (error) {
      next(error)
    }
  },

  getOrders: async (req, res, next) => {
    try {
      const orders = await orderServices.getOrderByAdmin()

      res.json({
        status: 'success',
        data: {
          orders
        }
      })

    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController