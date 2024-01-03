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

  addFavorite: async (req, res, next) => {
    try {
      const { productId } = req.params

      const product = await prisma.product.findFirst({
        where: { productId }
      })

      if (!product){
        throw createError(404, '商品不存在')
      }

      const favorite = await prisma.favorite.findFirst({
        where: {
          userId: req.user.id,
          productId
        }
      })

      if (favorite) {
        throw createError(404, '你已經收藏這項商品')
      } else {
        await prisma.favorite.create({
          userId: req.user.id,
          productId
        })
      }

    } catch(error) {
      next(error)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const { productId } = req.params

      const favorite = await prisma.favorite.findFirst({
        where: {
          userId: req.user.id,
          productId
        }
      })

      if (!favorite) {
        throw createError(404, '你未曾收藏這項商品')
      } else {
        await prisma.favorite.delete({
          where: {
          userId: req.user.id,
          productId
        }
        })
      }

    } catch (error) {
      next(error)
    }
  }

}

module.exports = userController
