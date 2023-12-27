const request = require('supertest')
const app = require('../../app')

describe('Product Controller Tests', () => {
  let testProduct

  test('getAllProduct should return a list of products', async () => {
    const query = {
      max: 200
    }

    const response = await request(app)
      .get('/apis/products')
      .query(query)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.data.products)).toBe(true)
    testProduct = response.body.data.products[0]
  })

  test('getProduct should return details of a specific product', async () => {
    const productId = testProduct.id

    const response = await request(app)
      .get(`/apis/products/${productId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data.product')
    expect(response.body.data.product).toHaveProperty('id', productId)
  })

})