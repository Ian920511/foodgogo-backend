const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const userController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const loginUser = await prisma.user.findFirst({
        where: { email },
        include: {
          cart: {
            select: { id: true}
          }
        }
      })
      
      if (!loginUser) {
        throw createError(404, '帳號不存在')
      }

      const isMatch = await bcrypt.compare(password, loginUser.password)

      if (!isMatch) {
        throw createError(400, '帳號或密碼錯誤')
      }

      const user = {
        id: loginUser.id,
        name: loginUser.username,
        email: loginUser.email,
        tel: loginUser.tel,
        address: loginUser.address,
        cartId: loginUser.cart[0].id,
        isAdmin: loginUser.isAdmin
      }

      const token = jwt.sign(user, process.env.TOKEN_SECRET,{
        expiresIn: '1d'
      })

      
      res.json({
        status: 'success',
        message: '登入成功',
        data: {
          user,
          token
        }
      })
    } catch(error) {
      next(error)
    }
  },

  register: async (req, res, next) => {
    try {
      const { email, password, address, tel, username, confirmPassword } = req.body

      if (password !== confirmPassword) { throw createError(400, '密碼與確認密碼不相同') }

      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: await bcrypt.hashSync(password, 10),
          tel,
          address,
          cart: {
            create: {}
          }
        }
      })

      const cart = await prisma.cart.findFirst({ where: { buyerId: newUser.id }})

      res.json({
        status: 'success',
        message: '註冊成功',
        data: {
          user: newUser,
          cart: cart
        }
      })

    } catch (error) {
      next(error)
    }
  },

  getCurrentUser: (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      tel: req.user.tel,
      address: req.user.address,
      isAdmin: req.user.isAdmin,
      cartid: req.user.cartId
    })
  },

  getFavorites: async (req, res, next) => {
    try {
      const userId = req.user.id

      const favorites = await prisma.favorite.findMany({
        where: { buyerId: userId },
        select: {
          product: true
        }
      })

      res.json({
        status: 'success',
        data: {
          favorites
        }
      })

    } catch (error) {
      next(error)
    }
  },

  addFavorite: async (req, res, next) => {
    try {
      const { productId } = req.params
      
      const product = await prisma.product.findFirst({
        where: { id: productId }
      })

      if (!product){
        throw createError(404, '商品不存在')
      }

      let newFavorite

      const favorite = await prisma.favorite.findFirst({
        where: {
          buyerId: req.user.id,
          productId
        }
      })
      
      if (favorite) {
        throw createError(400, '你已經收藏這項商品')
      } else {
        newFavorite = await prisma.favorite.create({
          data: {
            buyerId: req.user.id,
            productId
          },
          select: {
            id: true,
            buyerId: true,
            productId: true,
            product: true,
          }
        })
      }

      res.json({
        status: 'success',
        message: '新增收藏成功',
        data: {
          newFavorite
        }
      })

    } catch(error) {
      next(error)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const { productId } = req.params

      const favorite = await prisma.favorite.findFirst({
        where: {
          buyerId: req.user.id,
          productId
        }
      })

      if (!favorite) {
        throw createError(400, '你未曾收藏這項商品')
      } else {
        await prisma.favorite.delete({
          where: {
            id: favorite.id
          }
        })
      }

      res.json({
        status: 'success',
        message: '刪除收藏成功'
      })

    } catch (error) {
      next(error)
    }
  }

}

module.exports = userController
