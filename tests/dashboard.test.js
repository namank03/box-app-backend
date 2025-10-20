const request = require('supertest');
const app = require('../src/server');
const Order = require('../src/models/Order');
const Client = require('../src/models/Client');
const Material = require('../src/models/Material');
const Payment = require('../src/models/Payment');

describe('Dashboard API', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await Order.deleteMany({});
    await Client.deleteMany({});
    await Material.deleteMany({});
    await Payment.deleteMany({});
  });

  test('GET /api/dashboard/stats returns dashboard statistics', async () => {
    // Create test data
    const client = await Client.create({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    });

    const material = await Material.create({
      name: 'Test Material',
      unit: 'kg',
      currentStock: 5,
      lowStockThreshold: 10
    });

    const order = await Order.create({
      clientId: client._id,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'New',
      items: [],
      totalAmount: 1000
    });

    const payment = await Payment.create({
      clientId: client._id,
      clientName: client.name,
      amount: 500,
      paymentMethod: 'Bank Transfer',
      status: 'Completed'
    });

    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalOrders');
    expect(res.body.data).toHaveProperty('totalClients');
    expect(res.body.data).toHaveProperty('totalMaterials');
    expect(res.body.data).toHaveProperty('totalRevenue');
    expect(res.body.data).toHaveProperty('recentOrders');
    expect(res.body.data).toHaveProperty('recentPayments');
    expect(res.body.data).toHaveProperty('lowStockItems');
    expect(res.body.data).toHaveProperty('monthlyRevenue');

    // Verify specific values
    expect(res.body.data.totalOrders).toBe(1);
    expect(res.body.data.totalClients).toBe(1);
    expect(res.body.data.totalMaterials).toBe(1);
    expect(res.body.data.totalRevenue).toBe(500);
    expect(res.body.data.lowStockMaterials).toBe(1); // currentStock <= lowStockThreshold
    expect(Array.isArray(res.body.data.recentOrders)).toBe(true);
    expect(Array.isArray(res.body.data.recentPayments)).toBe(true);
    expect(Array.isArray(res.body.data.lowStockItems)).toBe(true);
    expect(Array.isArray(res.body.data.monthlyRevenue)).toBe(true);
  });

  test('GET /api/dashboard/stats handles empty database', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalOrders).toBe(0);
    expect(res.body.data.totalClients).toBe(0);
    expect(res.body.data.totalMaterials).toBe(0);
    expect(res.body.data.totalRevenue).toBe(0);
    expect(res.body.data.lowStockMaterials).toBe(0);
    expect(res.body.data.recentOrders).toHaveLength(0);
    expect(res.body.data.recentPayments).toHaveLength(0);
    expect(res.body.data.lowStockItems).toHaveLength(0);
  });

  test('GET /api/dashboard/stats calculates order statuses correctly', async () => {
    const client = await Client.create({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    });

    // Create orders with different statuses
    await Order.create({
      clientId: client._id,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'New',
      items: [],
      totalAmount: 100
    });

    await Order.create({
      clientId: client._id,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Confirmed',
      items: [],
      totalAmount: 200
    });

    await Order.create({
      clientId: client._id,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      items: [],
      totalAmount: 300
    });

    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.totalOrders).toBe(3);
    expect(res.body.data.pendingOrders).toBe(2); // New + Confirmed
    expect(res.body.data.completedOrders).toBe(1);
  });

  test('GET /api/dashboard/stats calculates payment statuses correctly', async () => {
    const client = await Client.create({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345'
    });

    // Create payments with different statuses
    await Payment.create({
      clientId: client._id,
      clientName: client.name,
      amount: 100,
      paymentMethod: 'Bank Transfer',
      status: 'Completed'
    });

    await Payment.create({
      clientId: client._id,
      clientName: client.name,
      amount: 200,
      paymentMethod: 'Cash',
      status: 'Pending'
    });

    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(200);
    expect(res.body.data.totalRevenue).toBe(300);
    expect(res.body.data.pendingPayments).toBe(1);
  });
});

