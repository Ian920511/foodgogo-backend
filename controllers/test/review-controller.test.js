const request = require('supertest')
const app = require('../../app')


describe('Product Controller Tests', () => {
  let productId
  let reviewId
  let token
  let adminToken

  beforeAll(async () => {
    const response = await request(app)
      .post('/apis/login')
      .send({ email: 'user3@gmail.com', password: '123456' })
    
    token = response.body.data.token

    const adminRes = await request(app)
      .post('/apis/login')
      .send({ email: 'admin@gmail.com', password: '123456' })
    
    adminToken = adminRes.body.data.token

    const productRes = await request(app)
      .get(`/apis/products`)

    productId = productRes.body.data.products[0].id
    
  })

  test('postReview should create a new review for a product', async () => {
    const reviewData = {
      productId: productId,
      comment: '很棒！',
      rating: 5
    }

    const response = await request(app)
      .post('/apis/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(reviewData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body).toHaveProperty('message', '新增評論成功')
    expect(response.body.data).toHaveProperty('review')
    
    reviewId = response.body.data.review.id
  })

  test('deleteReview should remove a review', async () => {
    const response = await request(app)
      .delete(`/apis/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body).toHaveProperty('message', '刪除評論成功')
  })

})