const errorResponse = {
  'LIMIT_FILE_SIZE': { statusCode: 400, message: '檔案超過限制大小'} ,
  'P2002': { statusCode: 400, message: '註冊帳號已存在'}
}


const errorHandler = (error, req, res, next) => {
  let { statusCode, message } = errorResponse[error.code] || {}

  statusCode = statusCode || error.statusCode || 500
  const status = statusCode.toString().startsWith('4') ? 'fail' : 'error'

  const response = {
    status,
    code: statusCode,
    message: message || error.message
  }

  res.status(statusCode).json(response)
}

module.exports = errorHandler