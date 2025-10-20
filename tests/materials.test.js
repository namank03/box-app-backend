const request = require('supertest');
const app = require('../src/server');
const Material = require('../src/models/Material');

describe('Materials API', () => {
  let createdId;

  beforeEach(async () => {
    // Clean up database before each test
    await Material.deleteMany({});
  });

  test('GET /api/materials returns list', async () => {
    const res = await request(app).get('/api/materials');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe('number');
  });

  test('POST /api/materials creates a material', async () => {
    const payload = {
      name: 'Jest Material',
      unit: 'pcs',
      currentStock: 3,
      lowStockThreshold: 1,
      description: 'Test material'
    };
    const res = await request(app).post('/api/materials').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.data.unit).toBe(payload.unit);
    expect(res.body.data.currentStock).toBe(payload.currentStock);
    expect(res.body.data.lowStockThreshold).toBe(payload.lowStockThreshold);
    createdId = res.body.data._id;
    expect(createdId).toBeTruthy();
  });

  test('POST /api/materials validates required fields', async () => {
    const payload = {
      // Missing name and unit
      currentStock: 3,
      lowStockThreshold: 1
    };
    const res = await request(app).post('/api/materials').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Name is required');
  });

  test('POST /api/materials validates unit enum', async () => {
    const payload = {
      name: 'Jest Material',
      unit: 'invalid_unit',
      currentStock: 3,
      lowStockThreshold: 1
    };
    const res = await request(app).post('/api/materials').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/materials/:id returns single material', async () => {
    // First create a material
    const payload = {
      name: 'Jest Material',
      unit: 'pcs',
      currentStock: 3,
      lowStockThreshold: 1
    };
    const createRes = await request(app).post('/api/materials').send(payload);
    createdId = createRes.body.data._id;

    const res = await request(app).get(`/api/materials/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(createdId);
  });

  test('GET /api/materials/:id returns 404 for non-existent material', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/materials/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Material not found');
  });

  test('PUT /api/materials/:id updates a material', async () => {
    // First create a material
    const payload = {
      name: 'Jest Material',
      unit: 'pcs',
      currentStock: 3,
      lowStockThreshold: 1
    };
    const createRes = await request(app).post('/api/materials').send(payload);
    createdId = createRes.body.data._id;

    const res = await request(app).put(`/api/materials/${createdId}`).send({
      currentStock: 10,
      name: 'Updated Material'
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentStock).toBe(10);
    expect(res.body.data.name).toBe('Updated Material');
  });

  test('PUT /api/materials/:id validates data', async () => {
    // First create a material
    const payload = {
      name: 'Jest Material',
      unit: 'pcs',
      currentStock: 3,
      lowStockThreshold: 1
    };
    const createRes = await request(app).post('/api/materials').send(payload);
    createdId = createRes.body.data._id;

    // Try to update with invalid data
    const res = await request(app).put(`/api/materials/${createdId}`).send({
      currentStock: -10
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('DELETE /api/materials/:id deletes a material', async () => {
    // First create a material
    const payload = {
      name: 'Jest Material',
      unit: 'pcs',
      currentStock: 3,
      lowStockThreshold: 1
    };
    const createRes = await request(app).post('/api/materials').send(payload);
    createdId = createRes.body.data._id;

    const res = await request(app).delete(`/api/materials/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Material deleted successfully');
  });

  test('DELETE /api/materials/:id returns 404 for non-existent material', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).delete(`/api/materials/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Material not found');
  });
});
