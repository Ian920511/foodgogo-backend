const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const userServices = require('./../services/user-services')
const cartServices = require('./../services/cart-services')
const favoriteServices = require('./../services/favorite-services')
const productServices = require('./../services/product-services')

const userController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const loginUser = await userServices.getUserByEmail(email)
      
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

      const newUser = await userServices.createUser(email, username, password, tel, address)

      const cart = await cartServices.getCartByUserId(newUser.id)

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

      const favorites = await favoriteServices.getFavoritesByUserId(userId)

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
      
      const product = await productServices.getProductById(productId)

      if (!product){
        throw createError(404, '商品不存在')
      }


      const favorite = await favoriteServices.getFavoriteByUserIdAndProductId(req.user.id, productId)
      
      if (favorite) {
        throw createError(400, '你已經收藏這項商品')
      } 

      const newFavorite = await favoriteServices.createFavorite(req.user.id, productId)

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

      const favorite = await favoriteServices.getFavoriteByUserIdAndProductId(req.user.id, productId)

      if (!favorite) {
        throw createError(400, '你未曾收藏這項商品')
      }

      await favoriteServices.deleteFavoriteById(favorite.id)

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
