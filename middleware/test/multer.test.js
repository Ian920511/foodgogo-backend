const multer = require('multer')
const cloudinary = require('cloudinary').v2

jest.mock('multer')
jest.mock('cloudinary')

multer.mockReturnValue({
  single: jest.fn(() => (req, res, next) => next())
})

const uploadMulter = require('./../multer')

describe('File Upload Middleware', () => {
  test('allows uploading valid file type', () => {
    const file = { originalname: 'test.jpg' }
    const fileFilter = multer.mock.calls[0][0].fileFilter

    fileFilter(null, file, (error, result) => {
      expect(error).toBeNull()
      expect(result).toBeTruthy()
    });
  });

  test('rejects invalid file type', () => {
    const file = { originalname: 'test.txt' }
    const fileFilter = multer.mock.calls[0][0].fileFilter

    fileFilter(null, file, (error) => {
      expect(error).toBeDefined()
      expect(error.status).toBe(400)
      expect(error.message).toBe('圖片檔案格式不符，請上傳 jpg / jpeg / png 檔案')
    })
  })

})