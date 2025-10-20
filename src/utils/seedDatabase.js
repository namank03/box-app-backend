const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Client = require('../models/Client');
const Branch = require('../models/Branch');
const Material = require('../models/Material');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Shipment = require('../models/Shipment');

// Mock data
const mockClients = [
  {
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    status: 'active'
  },
  {
    name: 'Globex Industries',
    email: 'info@globex.com',
    phone: '555-987-6543',
    address: '456 Tech Blvd',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    status: 'active'
  },
  {
    name: 'Stark Enterprises',
    email: 'hello@stark.com',
    phone: '555-789-0123',
    address: '789 Innovation Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02110',
    status: 'active'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await Client.deleteMany();
    await Branch.deleteMany();
    await Material.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Invoice.deleteMany();
    await Payment.deleteMany();
    await Shipment.deleteMany();
    console.log('Database cleared');

    // Insert clients
    const createdClients = await Client.insertMany(mockClients);
    console.log(`${createdClients.length} clients inserted`);

    // Create materials - focused on box manufacturing business
    const materials = [
      {
        name: 'Cardboard Sheets',
        description: 'Thick cardboard for box base',
        currentStock: 1000,
        price: 0.75,
        unit: 'sheets',
        lowStockThreshold: 100
      },
      {
        name: 'Colored Paper',
        description: 'Decorative paper for box lining',
        currentStock: 500,
        price: 0.20,
        unit: 'sheets',
        lowStockThreshold: 50
      },
      {
        name: 'Glue Stick',
        description: 'Adhesive for assembling boxes',
        currentStock: 200,
        price: 25.00,
        unit: 'pcs',
        lowStockThreshold: 20
      },
      {
        name: 'Ribbon',
        description: 'Decorative ribbon for box tying',
        currentStock: 150,
        price: 75.00,
        unit: 'rolls',
        lowStockThreshold: 15
      },
      {
        name: 'Print Sheets',
        description: 'Printed designs for box decoration',
        currentStock: 300,
        price: 2.50,
        unit: 'sheets',
        lowStockThreshold: 30
      },
      {
        name: 'Box Handles',
        description: 'Plastic handles for carrying boxes',
        currentStock: 500,
        price: 1.00,
        unit: 'pcs',
        lowStockThreshold: 50
      }
    ];

    const createdMaterials = await Material.insertMany(materials);
    console.log(`${createdMaterials.length} materials inserted`);

    // Create products
    const products = [
      {
        name: 'Small Box',
        description: 'Small shipping box for lightweight items',
        price: 2.99,
        materials: [
          {
            materialId: createdMaterials[0]._id,
            materialName: createdMaterials[0].name,
            quantity: 1,
            unit: createdMaterials[0].unit,
            unitPrice: createdMaterials[0].price
          }
        ],
        status: 'active'
      },
      {
        name: 'Medium Box',
        description: 'Medium shipping box for average items',
        price: 4.99,
        materials: [
          {
            materialId: createdMaterials[0]._id,
            materialName: createdMaterials[0].name,
            quantity: 2,
            unit: createdMaterials[0].unit,
            unitPrice: createdMaterials[0].price
          },
          {
            materialId: createdMaterials[1]._id,
            materialName: createdMaterials[1].name,
            quantity: 1,
            unit: createdMaterials[1].unit,
            unitPrice: createdMaterials[1].price
          }
        ],
        status: 'active'
      },
      {
        name: 'Large Box',
        description: 'Large shipping box for bulky items',
        price: 7.99,
        materials: [
          {
            materialId: createdMaterials[0]._id,
            materialName: createdMaterials[0].name,
            quantity: 3,
            unit: createdMaterials[0].unit,
            unitPrice: createdMaterials[0].price
          },
          {
            materialId: createdMaterials[1]._id,
            materialName: createdMaterials[1].name,
            quantity: 2,
            unit: createdMaterials[1].unit,
            unitPrice: createdMaterials[1].price
          },
          {
            materialId: createdMaterials[2]._id,
            materialName: createdMaterials[2].name,
            quantity: 1,
            unit: createdMaterials[2].unit,
            unitPrice: createdMaterials[2].price
          }
        ],
        status: 'active'
      },
      {
        name: 'Gift Box',
        description: 'Premium gift box with decorations',
        price: 15.99,
        materials: [
          {
            materialId: createdMaterials[0]._id,
            materialName: createdMaterials[0].name,
            quantity: 2,
            unit: createdMaterials[0].unit,
            unitPrice: createdMaterials[0].price
          },
          {
            materialId: createdMaterials[3]._id,
            materialName: createdMaterials[3].name,
            quantity: 1,
            unit: createdMaterials[3].unit,
            unitPrice: createdMaterials[3].price
          },
          {
            materialId: createdMaterials[4]._id,
            materialName: createdMaterials[4].name,
            quantity: 1,
            unit: createdMaterials[4].unit,
            unitPrice: createdMaterials[4].price
          }
        ],
        status: 'active'
      },
      {
        name: 'Deluxe Box',
        description: 'High-end box with premium materials',
        price: 8.99,
        materials: [
          {
            materialId: createdMaterials[0]._id,
            materialName: createdMaterials[0].name,
            quantity: 2,
            unit: createdMaterials[0].unit,
            unitPrice: createdMaterials[0].price
          },
          {
            materialId: createdMaterials[5]._id,
            materialName: createdMaterials[5].name,
            quantity: 2,
            unit: createdMaterials[5].unit,
            unitPrice: createdMaterials[5].price
          }
        ],
        status: 'active'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted`);

    // Create branches
    const branches = [
      {
        name: 'Downtown Branch',
        location: 'New York City',
        manager: 'John Smith',
        phone: '555-111-2222',
        clientId: createdClients[0]._id,
        status: 'active'
      },
      {
        name: 'West Coast HQ',
        location: 'San Francisco',
        manager: 'Jane Doe',
        phone: '555-333-4444',
        clientId: createdClients[1]._id,
        status: 'active'
      },
      {
        name: 'East Coast Office',
        location: 'Boston',
        manager: 'Robert Johnson',
        phone: '555-555-6666',
        clientId: createdClients[2]._id,
        status: 'active'
      }
    ];

    const createdBranches = await Branch.insertMany(branches);
    console.log(`${createdBranches.length} branches inserted`);

    // Create orders
    const orders = [
      {
        clientId: createdClients[0]._id,
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        items: [
          {
            productId: createdProducts[0]._id,
            productName: createdProducts[0].name,
            quantity: 10,
            unitPrice: createdProducts[0].price,
            totalPrice: createdProducts[0].price * 10
          },
          {
            productId: createdProducts[1]._id,
            productName: createdProducts[1].name,
            quantity: 5,
            unitPrice: createdProducts[1].price,
            totalPrice: createdProducts[1].price * 5
          }
        ],
        totalAmount: (10 * createdProducts[0].price) + (5 * createdProducts[1].price),
        status: 'Completed'
      },
      {
        clientId: createdClients[1]._id,
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        items: [
          {
            productId: createdProducts[1]._id,
            productName: createdProducts[1].name,
            quantity: 8,
            unitPrice: createdProducts[1].price,
            totalPrice: createdProducts[1].price * 8
          },
          {
            productId: createdProducts[2]._id,
            productName: createdProducts[2].name,
            quantity: 3,
            unitPrice: createdProducts[2].price,
            totalPrice: createdProducts[2].price * 3
          }
        ],
        totalAmount: (8 * createdProducts[1].price) + (3 * createdProducts[2].price),
        status: 'In Production'
      },
      {
        clientId: createdClients[2]._id,
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        items: [
          {
            productId: createdProducts[3]._id,
            productName: createdProducts[3].name,
            quantity: 2,
            unitPrice: createdProducts[3].price,
            totalPrice: createdProducts[3].price * 2
          },
          {
            productId: createdProducts[4]._id,
            productName: createdProducts[4].name,
            quantity: 3,
            unitPrice: createdProducts[4].price,
            totalPrice: createdProducts[4].price * 3
          }
        ],
        totalAmount: (2 * createdProducts[3].price) + (3 * createdProducts[4].price),
        status: 'New'
      }
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`${createdOrders.length} orders inserted`);

    // Create invoices
    const invoices = [
      {
        orderId: createdOrders[0]._id,
        clientId: createdClients[0]._id,
        clientName: createdClients[0].name,
        amount: createdOrders[0].totalAmount,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'Paid'
      },
      {
        orderId: createdOrders[1]._id,
        clientId: createdClients[1]._id,
        clientName: createdClients[1].name,
        amount: createdOrders[1].totalAmount,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'Pending'
      },
      {
        orderId: createdOrders[2]._id,
        clientId: createdClients[2]._id,
        clientName: createdClients[2].name,
        amount: createdOrders[2].totalAmount,
        invoiceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        status: 'Overdue'
      }
    ];

    const createdInvoices = await Invoice.insertMany(invoices);
    console.log(`${createdInvoices.length} invoices inserted`);

    // Create payments
    const payments = [
      {
        invoiceId: createdInvoices[0]._id,
        clientId: createdClients[0]._id,
        clientName: createdClients[0].name,
        amount: createdInvoices[0].amount,
        date: new Date(),
        paymentMethod: 'Credit Card',
        status: 'Completed'
      },
      {
        invoiceId: createdInvoices[1]._id,
        clientId: createdClients[1]._id,
        clientName: createdClients[1].name,
        amount: createdInvoices[1].amount * 0.5, // partial payment
        date: new Date(),
        paymentMethod: 'Bank Transfer',
        status: 'Pending'
      }
    ];

    const createdPayments = await Payment.insertMany(payments);
    console.log(`${createdPayments.length} payments inserted`);

    // Create shipments
    const shipments = [
      {
        orderId: createdOrders[0]._id,
        clientId: createdClients[0]._id,
        clientName: createdClients[0].name,
        trackingNumber: 'TRK' + Math.floor(Math.random() * 1000000),
        shipmentDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'Delivered'
      },
      {
        orderId: createdOrders[1]._id,
        clientId: createdClients[1]._id,
        clientName: createdClients[1].name,
        trackingNumber: 'TRK' + Math.floor(Math.random() * 1000000),
        shipmentDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'In Transit'
      }
    ];

    const createdShipments = await Shipment.insertMany(shipments);
    console.log(`${createdShipments.length} shipments inserted`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
