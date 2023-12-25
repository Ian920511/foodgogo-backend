const { authenticated, authenticatedAdmin } = require('./../auth')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

jest.mock('http-errors')
jest.mock('jsonwebtoken')

describe('Authentication Middleware Tests', () => {
  const mockRequest = (headers, user) => ({
    headers: headers || {},
    user: user || null
  })

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should throw 401 if no authorization header is present', async () => {
    const req = mockRequest()
    const res = mockResponse()

    await authenticated(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(401, '需登入才能使用此功能')
  })

  test('should throw 401 if JWT verification fails', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    })

    const req = mockRequest({ authorization: 'Bearer invalidtoken' })
    const res = mockResponse()

    await authenticated(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(401, '登入驗證已過期或是無效，請重新登入')
  })

  test('should set user and call next if valid JWT', async () => {
    const decodedToken = { id: '123', name: 'Test User' }
    jwt.verify.mockResolvedValue(decodedToken);

    const req = mockRequest({ authorization: 'Bearer validtoken' })
    const res = mockResponse();

    await authenticated(req, res, mockNext)

    expect(req.user).toEqual(decodedToken)
    expect(mockNext).toHaveBeenCalled()
  })

  test('should throw 403 if user is not admin in authenticatedAdmin', () => {
    const req = mockRequest(null, { isAdmin: false })
    const res = mockResponse()

    authenticatedAdmin(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(403, '無此頁面權限')
  })
})