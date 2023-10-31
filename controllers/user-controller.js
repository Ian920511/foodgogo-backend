const bcrypt = require('bcrypt')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const userController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await prisma.user.findFirst({
        where: { email },
        include: {
          cart: {
            select: { id: true}
          }
        }
      })

      if (!user) {
        throw createError(404, '帳號不存在')
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw createError(400, '帳號或密碼錯誤')
      }

      const payload = {
        id: user.id,
        email: user.email,
        cartId: user.cart[0].id
      }

      const token = jwt.sign(payload, process.env.TOKEN_SECRET,{
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
}

module.exports = userController
