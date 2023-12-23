const createError = require('http-errors')
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'productImage'
  }
})

const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname).toLowerCase()

  if (!['.jpg', '.jepg', '.png'].includes(ext)) {
    return cb(createError(400, '圖片檔案格式不符，請上傳 jpg / jpeg / png 檔案'))
  }

  cb(null, true)
}

const uploadMulter = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1
  }
}).single('image')

module.exports = uploadMulter