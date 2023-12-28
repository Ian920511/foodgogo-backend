const request = require('supertest')
const app = require('../../app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

describe('Cart Controller Tests', () => {
  let token
  let orderId
 
  beforeAll(async () => {
    const response = await request(app)
      .post('/apis/login')
      .send({ email: 'user3@gmail.com', password: '123456' })
    
    token = response.body.data.token
  })

  afterAll(async () => {
    try {
        await prisma.orderDetail.delete({ where: { orderId }})
        await prisma.order.delete({ where: { id: orderId }})
      } catch (error) {
        console.log(error)
      }
  })

  test('getOrders should return a list of orders for a user', async () => {
    const response = await request(app)
      .get('/apis/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data.orders')
    expect(Array.isArray(response.body.data.orders)).toBe(true)
    
  })

  test('createOrder should create a new order based on the cart contents', async () => {
    const cartItem =  {
      cartId: 'ba79d5d7-68e9-4534-ad04-7b2db5c9f03f',
      productId: '100be702-40e1-4d3a-a547-84e3b8566f1e',
      quantity: 1
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cartItem.cartId }})
    await prisma.cartItem.create({ data: cartItem })


    const response = await request(app)
      .post('/apis/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', '新增訂單成功')
    expect(response.body.data).toHaveProperty('order')
    expect(response.body.data).toHaveProperty('orderDetails')
    orderId = response.body.data.order.id
  })

  test('getOrder should return details of a specific order', async () => {
    const response = await request(app)
      .get(`/apis/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data.order')

  })

})