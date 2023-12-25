const errorHandler = require('./../error-handler')

describe('Error Handler Middleware', () => {
  const mockRequest = () => ({})
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('handles known error code correctly', () => {
    const error = { code: 'LIMIT_FILE_SIZE' }
    const req = mockRequest()
    const res = mockResponse()

    errorHandler(error, req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      code: 400,
      message: '檔案超過限制大小'
    })
  })

  test('uses statusCode from error object if present', () => {
    const error = { statusCode: 404, message: '找不到資源' }
    const req = mockRequest()
    const res = mockResponse()

    errorHandler(error, req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      code: 404,
      message: '找不到資源'
    })
  })

})