const request = require('supertest')
const app = require('../../app')
const jwt = require('jsonwebtoken')
const path = require('path')

describe('Admin Controller Tests', () => {
  let token
  let createdProductId
  let categoryId

  beforeAll(async () => {
    const admin = {
        id: 'mockedUserId',
        name: 'mockedUserName',
        email: 'mockedUserEmail',
        tel: 'mockedUserTel',
        address: 'mockedUserAddress',
        cartId: 'mockedUserCartId',
        isAdmin: true
    }

    token = jwt.sign(admin, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    const response = await request(app)
      .get('/apis/categories')

    categoryId = response.body.data.categories[0].id

  })


  test('getProducts should return a list of products', async () => {
    const response = await request(app)
      .get('/apis/admin/products')
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(Array.isArray(response.body.data.products)).toBe(true)
  })

  
  test('createProduct should create a new product', async () => {
    const mockFilePath = path.join(__dirname, '/fixtures/mockFile.png')
    
    const response = await request(app)
      .post('/apis/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Mock Product')
      .field('description', 'Mock Description')
      .field('price', 100)
      .field('categoryId', '61181a7d-bf5a-4114-8a35-d7688cf187a2')
      .attach('image', mockFilePath)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', '商品新增成功')
    createdProductId = response.body.data.product.id
  })

  
  test('updateProduct should update an existing product', async () => {
    const updatedProduct = {
      name: 'Updated Name',
      description: 'Updated Description',
      price: 200,
      categoryId: '61181a7d-bf5a-4114-8a35-d7688cf187a2' 
    }

    const response = await request(app)
      .put(`/apis/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProduct)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '商品更新完成')
  })

   test('updateProductStatus should update the status of an existing product', async () => {
    const newStatus = false

    const response = await request(app)
      .patch(`/apis/admin/products/${createdProductId}`)
      .query({ active: newStatus })
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', '商品狀態更新成功');
    expect(response.body.data.product).toHaveProperty('active', newStatus);
  })

  
  test('deleteProduct should delete a product', async () => {
    const response = await request(app)
      .delete(`/apis/admin/products/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message', '商品刪除完成')
  })

  
  test('getOrders should return a list of orders', async () => {
    const response = await request(app)
      .get('/apis/admin/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(Array.isArray(response.body.data.orders)).toBe(true)
  })

})

