const createError = require('http-errors')

const authValidation = (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return next(createError(400, '信箱不得為空'))
  }

  if (!password) {
    return next(createError(400, '密碼不得為空'))
  }

  next()
}

module.exports = { authValidation }