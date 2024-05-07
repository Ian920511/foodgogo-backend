const request = require('supertest')
const app = require('../../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('Cart Controller Tests', () => {
  let token
  let cartItemId
  let productId
 
  beforeAll(async () => {
    const response = await request(app)
      .post('/apis/login')
      .send({ email: 'user1@gmail.com', password: '123456' })
    
    token = response.body.data.token

    const productRes = await request(app)
      .get(`/apis/products`)

    productId = productRes.body.data.products[0].id

 
  })

  test('getCartItems should return the cart items for a user', async () => {
    const response = await request(app)
      .get('/apis/carts/')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data.cart')
    expect(Array.isArray(response.body.data.cart.cartItem)).toBe(true)
  })

  test('postCartItem should add a product to the cart', async () => {
    const quantity = 1

    const response = await request(app)
      .post('/apis/carts/')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '新增購物車商品成功')
    cartItemId = response.body.data.cartItem.id

  })

  test('updateCartItem should update the quantity of a product in the cart',      async () => {
    const newQuantity = 2

    const response = await request(app)
      .patch(`/apis/carts/${cartItemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: newQuantity })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '購物車商品更新成功')
  })

  test('deleteCartItem should remove a product from the cart', async () => {
    const response = await request(app)
      .delete(`/apis/carts//${cartItemId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '刪除購物車商品成功')
  })

})