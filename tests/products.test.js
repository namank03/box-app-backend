const request = require('supertest');
const app = require('../src/server');

describe('Products API', () => {
  test('GET /api/products returns list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/products/:id/materials returns BOM', async () => {
    const productId = 'product1';
    const res = await request(app).get(`/api/products/${productId}/materials`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
