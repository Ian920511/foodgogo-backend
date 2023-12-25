const { authValidation } = require('./../validation')
const createError = require('http-errors')

jest.mock('http-errors')

describe('Authentication Validation Middleware', () => {
  const mockRequest = (body) => ({ body })
  const mockResponse = () => ({})
  const mockNext = jest.fn()

  test('returns an error if email is missing', () => {
    const req = mockRequest({ password: 'password123' })
    const res = mockResponse()

    authValidation('login')(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(400, '信箱不得為空')
  })

  test('returns an error if password is missing', () => {
    const req = mockRequest({ email: 'test@example.com' })
    const res = mockResponse()

    authValidation('login')(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(400, '密碼不得為空')
  })

  test('returns an error if confirmPassword is missing during registration', () => {
    const req = mockRequest({ email: 'test@example.com', password: 'password123' })
    const res = mockResponse()

    authValidation('register')(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(400, '確認密碼不得為空')
  })

  test('returns an error if password and confirmPassword do not match during registration', () => {
    const req = mockRequest({ email: 'test@example.com', password: 'password123', confirmPassword: 'differentPassword' })
    const res = mockResponse()

    authValidation('register')(req, res, mockNext)

    expect(createError).toHaveBeenCalledWith(400, '密碼與確認密碼不同')
  })

  test('calls next() when all fields are valid', () => {
    const req = mockRequest({ email: 'test@example.com', password: 'password123', confirmPassword: 'password123' })
    const res = mockResponse()

    authValidation('register')(req, res, mockNext)

    expect(mockNext).toHaveBeenCalled()
  })

})
