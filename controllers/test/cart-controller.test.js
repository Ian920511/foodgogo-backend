const request = require('supertest')
const app = require('../../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

describe('Cart Controller Tests', () => {
  let token
  let cartItemId

  beforeAll(() => {
    const user = {
        username: "user1",
        email: "user1@gmail.com",
        password: bcrypt.hashSync('123456', 10),
        address: "台北",
        tel: "09123456789",
        isAdmin: false,
    }

    token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1d' })
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
    const productId = '100be702-40e1-4d3a-a547-84e3b8566f1e'
    const quantity = 1

    const response = await request(app)
      .post('/apis/carts/')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '新增購物車商品成功')
    cartItemId = response.body.data.cartItem.id
  })

  test('updateCartItem should update the quantity of a product in the cart', async () => {
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