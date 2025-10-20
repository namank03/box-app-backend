const request = require('supertest');
const app = require('../src/server');
const Client = require('../src/models/Client');
const Branch = require('../src/models/Branch');

describe('Clients API', () => {
  let clientId;

  beforeEach(async () => {
    // Clean up database before each test
    await Client.deleteMany({});
    await Branch.deleteMany({});
  });

  test('GET /api/clients returns list', async () => {
    const res = await request(app).get('/api/clients');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe('number');
  });

  test('POST /api/clients creates a client', async () => {
    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };

    const res = await request(app).post('/api/clients').send(clientData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(clientData.name);
    expect(res.body.data.email).toBe(clientData.email);
    clientId = res.body.data._id;
  });

  test('POST /api/clients validates required fields', async () => {
    const clientData = {
      // Missing name, email, phone, address, city, state, zipCode
      name: 'Test Client'
    };

    const res = await request(app).post('/api/clients').send(clientData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Name is required');
  });

  test('POST /api/clients validates email format', async () => {
    const clientData = {
      name: 'Test Client',
      email: 'invalid-email',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };

    const res = await request(app).post('/api/clients').send(clientData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Email format is invalid');
  });

  test('GET /api/clients/:id returns single client', async () => {
    // First create a client
    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };
    const createRes = await request(app).post('/api/clients').send(clientData);
    clientId = createRes.body.data._id;

    const res = await request(app).get(`/api/clients/${clientId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(clientId);
  });

  test('GET /api/clients/:id returns 404 for non-existent client', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/clients/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Client not found');
  });

  test('PUT /api/clients/:id updates a client', async () => {
    // First create a client
    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };
    const createRes = await request(app).post('/api/clients').send(clientData);
    clientId = createRes.body.data._id;

    const updateData = {
      name: 'Updated Client',
      phone: '0987654321'
    };

    const res = await request(app).put(`/api/clients/${clientId}`).send(updateData);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Client');
    expect(res.body.data.phone).toBe('0987654321');
  });

  test('DELETE /api/clients/:id deletes a client', async () => {
    // First create a client
    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };
    const createRes = await request(app).post('/api/clients').send(clientData);
    clientId = createRes.body.data._id;

    const res = await request(app).delete(`/api/clients/${clientId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Client deleted successfully');
  });

  test('GET /api/clients/:id/branches returns client branches', async () => {
    // First create a client
    const clientData = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    };
    const createRes = await request(app).post('/api/clients').send(clientData);
    clientId = createRes.body.data._id;

    // Create a branch for the client
    await Branch.create({
      name: 'Test Branch',
      location: 'Test Location',
      clientId
    });

    const res = await request(app).get(`/api/clients/${clientId}/branches`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Test Branch');
  });
});
