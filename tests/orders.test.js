const request = require('supertest');
const app = require('../src/server');
const Order = require('../src/models/Order');
const Client = require('../src/models/Client');
const Product = require('../src/models/Product');

describe('Orders API', () => {
  let clientId, productId, orderId;

  beforeEach(async () => {
    // Clean up database before each test
    await Order.deleteMany({});
    await Client.deleteMany({});
    await Product.deleteMany({});

    // Create test client
    const client = await Client.create({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    });
    clientId = client._id;

    // Create test product
    const product = await Product.create({
      name: 'Test Product',
      description: 'Test product description',
      price: 100,
      materials: []
    });
    productId = product._id;
  });

  test('GET /api/orders returns list', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.count).toBe('number');
  });

  test('POST /api/orders creates an order', async () => {
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      priority: 'Medium',
      orderSource: 'Manual',
      notes: 'Test order',
      items: [{
        productId: productId.toString(),
        productName: 'Test Product',
        quantity: 2,
        unitPrice: 100,
        totalPrice: 200
      }]
    };

    const res = await request(app).post('/api/orders').send(orderData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.clientId).toBe(clientId.toString());
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.totalAmount).toBe(200);
    orderId = res.body.data._id;
  });

  test('POST /api/orders validates required fields', async () => {
    const orderData = {
      // Missing clientId and deliveryDate
      status: 'New',
      items: []
    };

    const res = await request(app).post('/api/orders').send(orderData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Client ID is required');
  });

  test('POST /api/orders validates client exists', async () => {
    const orderData = {
      clientId: '507f1f77bcf86cd799439011', // Non-existent client
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: []
    };

    const res = await request(app).post('/api/orders').send(orderData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Client not found');
  });

  test('POST /api/orders validates items', async () => {
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: [{
        // Missing productId, quantity, unitPrice
        productName: 'Test Product'
      }]
    };

    const res = await request(app).post('/api/orders').send(orderData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Each item must have productId, quantity, and unitPrice');
  });

  test('GET /api/orders/:id returns single order', async () => {
    // First create an order
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: []
    };
    const createRes = await request(app).post('/api/orders').send(orderData);
    orderId = createRes.body.data._id;

    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(orderId);
    expect(res.body.data.clientName).toBe('Test Client');
  });

  test('GET /api/orders/:id returns 404 for non-existent order', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/orders/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Order not found');
  });

  test('PUT /api/orders/:id updates an order', async () => {
    // First create an order
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: []
    };
    const createRes = await request(app).post('/api/orders').send(orderData);
    orderId = createRes.body.data._id;

    const updateData = {
      status: 'Confirmed',
      priority: 'High',
      notes: 'Updated order'
    };

    const res = await request(app).put(`/api/orders/${orderId}`).send(updateData);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Confirmed');
    expect(res.body.data.priority).toBe('High');
    expect(res.body.data.notes).toBe('Updated order');
  });

  test('PUT /api/orders/:id validates client if provided', async () => {
    // First create an order
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: []
    };
    const createRes = await request(app).post('/api/orders').send(orderData);
    orderId = createRes.body.data._id;

    const updateData = {
      clientId: '507f1f77bcf86cd799439011' // Non-existent client
    };

    const res = await request(app).put(`/api/orders/${orderId}`).send(updateData);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Client not found');
  });

  test('DELETE /api/orders/:id deletes an order', async () => {
    // First create an order
    const orderData = {
      clientId: clientId.toString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'New',
      items: []
    };
    const createRes = await request(app).post('/api/orders').send(orderData);
    orderId = createRes.body.data._id;

    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Order deleted successfully');
  });

  test('DELETE /api/orders/:id returns 404 for non-existent order', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).delete(`/api/orders/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Order not found');
  });
});
