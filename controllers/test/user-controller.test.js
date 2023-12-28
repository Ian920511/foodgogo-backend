const request = require('supertest')
const app = require('../../app')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

describe('User Controller Tests', () => {
  let token
  let createdUserId
  let cartId

  afterAll(async () => {
    if (createdUserId) {
      try {
        await prisma.cart.delete({ where: { id: cartId }})
        await prisma.user.delete({ where: { id: createdUserId }})
      } catch (error) {
        console.log(error)
      }
    }
  })

  test('login should authenticate a user and return a token', async () => {
    const userCredentials = { email: 'user3@gmail.com', password: '123456' }

    const response = await request(app)
      .post('/apis/login')
      .send(userCredentials)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '登入成功')
    expect(response.body.data).toHaveProperty('token')
    token = response.body.data.token
  })

  test('register should create a new user', async () => {
    const newUser = {
      email: 'user99@gmail.com',
      password: '123456',
      confirmPassword: '123456',
      address: '123',
      tel: '1234567890',
      username: 'newUser'
    }

    const response = await request(app)
      .post('/apis/register')
      .send(newUser)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '註冊成功')
    
    createdUserId = response.body.data.user.id
    cartId = response.body.data.cart.id
  })

  test('getCurrentUser should return the current user details', async () => {
    const response = await request(app)
      .get('/apis/get_current_user')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('cartid')
  })

})