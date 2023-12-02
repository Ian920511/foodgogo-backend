const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500
  let code = error.code || 500
  let message = error.message

  if (error.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400
    code = 400
    message = '檔案超過限制大小'
  }

  if (error.code === 'P2002') {
    statusCode = 400
    code = 400
    message = '註冊帳號已存在'
  }

  const status = statusCode.toString().startsWith('4') ? 'fail' : 'error'

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      status,
      code,
      message
    })
  } else {
    res.status(statusCode).json({
      status,
      code,
      message,
      stack: error.stack
    })
  }
}

module.exports = errorHandler