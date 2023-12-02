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

app.use(errorHandler)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})