const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createError = require('http-errors')

const adminController = {
  getProducts: async (req, res, next) => {
    try {
    const products = await prisma.product.findMany({
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
        },
      }
    })

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

      const product = await prisma.product.create({
        data: {
          name,
          description,
          image: file.path,
          price: Number(price),
          categoryId
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

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
      
      const product = await prisma.product.findFirst({ where: { id: productId } })
   
      if (!product) {
        throw createError(404, '該商品不存在')
      }

      const updateProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          image: file ? file.path : product.image,
          price: Number(price),
          categoryId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          price: true,
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

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

      const updateProduct = await prisma.product.update({ where: { id: productId }, data: { active } })

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

      await prisma.product.delete({ where: { id: productId }})

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
      const orders = await prisma.order.findMany({
        select: {
          id: true,
          createdAt: true,
          totalPrice: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              address: true,
              tel: true,
            }
          },
          orderDetail: {
            select: {
              id: true,
              quantity: true,
              priceAtTime: true,
              product: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      })

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