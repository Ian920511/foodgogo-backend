const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const authenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      throw createError(401, '需登入才能使用此功能')
    }
    
    const token =  authorization.split(' ')[1]

    try {
      const decoded = await jwt.verify(token, process.env.TOKEN_SECRET)

      req.user = decoded

      next()
    } catch (error) {
      throw createError(401, '登入驗證已過期或是無效，請重新登入')
    }

  } catch(error) {
    next(error)
  }
}

const authenticatedAdmin = (req, res, next) => {
  const { user } = req

  if (!user || !user.isAdmin) {
    return next (createError(403, '無此頁面權限'))
  }

  next()
}

module.exports = { authenticated, authenticatedAdmin }