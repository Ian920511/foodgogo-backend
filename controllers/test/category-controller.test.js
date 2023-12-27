const request = require('supertest')
const app = require('../../app')

describe('Category Controller Tests', () => {

  test('getCategories should return a list of categories', async () => {
    const response = await request(app)
      .get('/apis/categories')


    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data.categories');
    expect(Array.isArray(response.body.data.categories)).toBe(true);
 
  })

})