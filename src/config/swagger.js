const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Box Manufacturing Backend API',
      version: '1.0.0',
      description: 'A comprehensive backend API for box manufacturing business management. This API handles clients, orders, materials, products, payments, invoices, shipments, and business analytics.',
      contact: {
        name: 'API Support',
        email: 'support@boxmanufacturing.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://your-production-api.com'
          : `http://localhost:${process.env.PORT || 5001}`,
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authentication token (structure in place, implementation incomplete)'
        }
      },
      schemas: {
        // Client Schema
        Client: {
          type: 'object',
          required: ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            name: {
              type: 'string',
              description: 'Client company name',
              example: 'Acme Corporation'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Client email address (must be unique)',
              example: 'contact@acme.com'
            },
            phone: {
              type: 'string',
              description: 'Client phone number',
              example: '+1-555-123-4567'
            },
            address: {
              type: 'string',
              description: 'Client street address',
              example: '123 Business St, Suite 100'
            },
            city: {
              type: 'string',
              description: 'Client city',
              example: 'New York'
            },
            state: {
              type: 'string',
              description: 'Client state/province',
              example: 'NY'
            },
            zipCode: {
              type: 'string',
              description: 'Client postal code',
              example: '10001'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'pending'],
              description: 'Client status',
              default: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },

        // Branch Schema
        Branch: {
          type: 'object',
          required: ['name', 'location', 'clientId'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7d9'
            },
            name: {
              type: 'string',
              description: 'Branch name',
              example: 'Main Office'
            },
            location: {
              type: 'string',
              description: 'Branch location/address',
              example: '456 Corporate Plaza, Chicago'
            },
            manager: {
              type: 'string',
              description: 'Branch manager name',
              example: 'John Smith'
            },
            phone: {
              type: 'string',
              description: 'Branch phone number',
              example: '+1-555-987-6543'
            },
            clientId: {
              type: 'string',
              description: 'Parent client ID',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Branch status',
              default: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Material Schema
        Material: {
          type: 'object',
          required: ['name', 'unit', 'currentStock', 'price'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7da'
            },
            name: {
              type: 'string',
              description: 'Material name',
              example: 'Corrugated Cardboard'
            },
            description: {
              type: 'string',
              description: 'Material description',
              example: 'High-quality corrugated cardboard for box manufacturing'
            },
            unit: {
              type: 'string',
              enum: ['kg', 'lbs', 'pcs', 'm', 'sqm', 'liters', 'sheets', 'rolls'],
              description: 'Unit of measurement',
              example: 'kg'
            },
            currentStock: {
              type: 'number',
              description: 'Current stock quantity',
              example: 500
            },
            price: {
              type: 'number',
              description: 'Price per unit',
              example: 2.50
            },
            lowStockThreshold: {
              type: 'number',
              description: 'Alert threshold for low stock',
              example: 50
            },
            status: {
              type: 'string',
              enum: ['in_stock', 'low_stock', 'out_of_stock'],
              description: 'Current stock status (automatically calculated)',
              example: 'in_stock'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Product Schema
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'materials'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7db'
            },
            name: {
              type: 'string',
              description: 'Product name',
              example: 'Standard Shipping Box - 12x12x12'
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: '12x12x12 inch corrugated cardboard box suitable for shipping'
            },
            price: {
              type: 'number',
              description: 'Product price per unit',
              example: 3.99
            },
            materials: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  materialId: {
                    type: 'string',
                    description: 'Material ID reference',
                    example: '65f8a9b2c1d2e3f4a5b6c7da'
                  },
                  materialName: {
                    type: 'string',
                    description: 'Material name',
                    example: 'Corrugated Cardboard'
                  },
                  quantity: {
                    type: 'number',
                    description: 'Quantity required',
                    example: 2
                  },
                  unit: {
                    type: 'string',
                    description: 'Unit of measurement',
                    example: 'kg'
                  },
                  unitPrice: {
                    type: 'number',
                    description: 'Price per unit',
                    example: 2.50
                  }
                }
              },
              description: 'Materials required for this product (Bill of Materials)'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Product status',
              default: 'active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Order Schema
        Order: {
          type: 'object',
          required: ['clientId', 'deliveryDate', 'items'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7dc'
            },
            clientId: {
              type: 'string',
              description: 'Client ID',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            orderDate: {
              type: 'string',
              format: 'date',
              description: 'Order date',
              example: '2024-03-15'
            },
            deliveryDate: {
              type: 'string',
              format: 'date',
              description: 'Expected delivery date',
              example: '2024-03-25'
            },
            status: {
              type: 'string',
              enum: ['New', 'Confirmed', 'In Production', 'Packed', 'Partially Shipped', 'Completed', 'Cancelled'],
              description: 'Order status',
              default: 'New'
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              description: 'Order priority',
              default: 'Medium'
            },
            orderSource: {
              type: 'string',
              description: 'Order source',
              default: 'Manual'
            },
            notes: {
              type: 'string',
              description: 'Order notes',
              example: 'Urgent delivery requested'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: {
                    type: 'string',
                    description: 'Product ID',
                    example: '65f8a9b2c1d2e3f4a5b6c7db'
                  },
                  productName: {
                    type: 'string',
                    description: 'Product name',
                    example: 'Standard Shipping Box - 12x12x12'
                  },
                  quantity: {
                    type: 'number',
                    description: 'Order quantity',
                    example: 100
                  },
                  unitPrice: {
                    type: 'number',
                    description: 'Price per unit',
                    example: 3.99
                  },
                  totalPrice: {
                    type: 'number',
                    description: 'Total price for this item (quantity × unitPrice)',
                    example: 399.00
                  }
                }
              },
              description: 'Order items'
            },
            totalAmount: {
              type: 'number',
              description: 'Total order amount (automatically calculated)',
              example: 598.00
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Invoice Schema
        Invoice: {
          type: 'object',
          required: ['clientId', 'clientName', 'amount'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7dd'
            },
            invoiceNumber: {
              type: 'string',
              description: 'Unique invoice number (auto-generated)',
              example: 'INV-1712345678-abc123def'
            },
            orderId: {
              type: 'string',
              description: 'Associated order ID',
              example: '65f8a9b2c1d2e3f4a5b6c7dc'
            },
            clientId: {
              type: 'string',
              description: 'Client ID',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            clientName: {
              type: 'string',
              description: 'Client name',
              example: 'Acme Corporation'
            },
            amount: {
              type: 'number',
              description: 'Invoice amount',
              example: 598.00
            },
            invoiceDate: {
              type: 'string',
              format: 'date',
              description: 'Invoice date',
              example: '2024-03-15'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Payment due date',
              example: '2024-04-15'
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Paid', 'Overdue'],
              description: 'Invoice payment status',
              default: 'Pending'
            },
            notes: {
              type: 'string',
              description: 'Invoice notes',
              example: 'Payment terms: Net 30 days'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Payment Schema
        Payment: {
          type: 'object',
          required: ['clientId', 'clientName', 'amount', 'paymentMethod'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7de'
            },
            paymentNumber: {
              type: 'string',
              description: 'Unique payment number (auto-generated)',
              example: 'PAY-1712345678-xyz456abc'
            },
            invoiceId: {
              type: 'string',
              description: 'Associated invoice ID',
              example: '65f8a9b2c1d2e3f4a5b6c7dd'
            },
            clientId: {
              type: 'string',
              description: 'Client ID',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            clientName: {
              type: 'string',
              description: 'Client name',
              example: 'Acme Corporation'
            },
            amount: {
              type: 'number',
              description: 'Payment amount',
              example: 598.00
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Payment date',
              example: '2024-03-20'
            },
            paymentMethod: {
              type: 'string',
              enum: ['Bank Transfer', 'Cash', 'Check', 'Credit Card', 'UPI'],
              description: 'Payment method',
              example: 'Bank Transfer'
            },
            status: {
              type: 'string',
              enum: ['Pending', 'Completed', 'Failed'],
              description: 'Payment status',
              default: 'Pending'
            },
            referenceNumber: {
              type: 'string',
              description: 'Bank transaction reference number',
              example: 'TXN123456789'
            },
            notes: {
              type: 'string',
              description: 'Payment notes',
              example: 'Payment for order #12345'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Shipment Schema
        Shipment: {
          type: 'object',
          required: ['clientId', 'clientName', 'trackingNumber'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated unique identifier',
              example: '65f8a9b2c1d2e3f4a5b6c7df'
            },
            shipmentNumber: {
              type: 'string',
              description: 'Unique shipment number (auto-generated)',
              example: 'SHIP-1712345678-def789ghi'
            },
            orderId: {
              type: 'string',
              description: 'Associated order ID',
              example: '65f8a9b2c1d2e3f4a5b6c7dc'
            },
            clientId: {
              type: 'string',
              description: 'Client ID',
              example: '65f8a9b2c1d2e3f4a5b6c7d8'
            },
            clientName: {
              type: 'string',
              description: 'Client name',
              example: 'Acme Corporation'
            },
            trackingNumber: {
              type: 'string',
              description: 'Shipping tracking number',
              example: '1Z999AA1234567890'
            },
            shipmentDate: {
              type: 'string',
              format: 'date',
              description: 'Shipment date',
              example: '2024-03-18'
            },
            estimatedDelivery: {
              type: 'string',
              format: 'date',
              description: 'Estimated delivery date',
              example: '2024-03-22'
            },
            status: {
              type: 'string',
              enum: ['Pending', 'In Transit', 'Delivered'],
              description: 'Shipment status',
              default: 'Pending'
            },
            notes: {
              type: 'string',
              description: 'Shipment notes',
              example: 'Handle with care - fragile items'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data (varies by endpoint)'
            },
            count: {
              type: 'integer',
              description: 'Number of items in data array',
              example: 5
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            }
          }
        },

        PaginationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Paginated data items'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  description: 'Items per page',
                  example: 10
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items',
                  example: 50
                },
                pages: {
                  type: 'integer',
                  description: 'Total number of pages',
                  example: 5
                },
                hasNext: {
                  type: 'boolean',
                  description: 'Whether there are more pages',
                  example: true
                },
                hasPrev: {
                  type: 'boolean',
                  description: 'Whether there are previous pages',
                  example: false
                }
              }
            },
            count: {
              type: 'integer',
              description: 'Number of items in current page',
              example: 10
            }
          }
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            error: {
              type: 'object',
              description: 'Error details (development only)'
            }
          }
        },

        // Query Parameters Schema
        PaginationQuery: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Page number (starts from 1)',
              example: 1,
              default: 1
            },
            limit: {
              type: 'integer',
              description: 'Items per page (max 100)',
              example: 10,
              default: 10
            },
            sort: {
              type: 'string',
              description: 'Sort field and order (use - for descending)',
              example: '-createdAt',
              default: '-createdAt'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;