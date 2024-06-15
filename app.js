if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('./swagger.json')

const routes = require('./routes/index')
const errorHandler = require('./middleware/error-handler')

const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  const morgan = require('morgan')
  app.use(morgan('dev'))
}

require('./cron/expiredOrdersCron')

app.use(cors())
app.use(express.json())

app.use('/apis', routes)

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      supportedSubmitMethods: []
    }
  })
)

app.all('/*', (req, res, next) => {
  next(createError(404, '無效路由'))
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
  });
}

module.exports = app