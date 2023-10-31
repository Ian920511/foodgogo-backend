const createError = require('http-errors')

const authValidation = (act) => {
  return (req, res, next) => {
    const { email, password } = req.body

    if (!email) {
      return next(createError(400, '信箱不得為空'))
    }

    if (!password) {
      return next(createError(400, '密碼不得為空'))
    }

    if (act === 'register') {
      const { confirmPassword } = req.body

      if (!confirmPassword) {
        return next(createError(400, '確認密碼不得為空'))
      }

      if (confirmPassword !== password) {
        return next(createError(400, '密碼與確認密碼不同'))
      }
    }

    next()
  }
}
  

module.exports = { authValidation }