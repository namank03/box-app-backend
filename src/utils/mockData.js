// Mock data for development - simplified with string IDs
const mockData = {
  clients: [
    { _id: 'client1', name: 'Sweet Delights', contactPerson: 'John Smith', phone: '9876543210', whatsapp: '9876543210', email: 'john@sweetdelights.com', address: '123 Baker Street, Mumbai', createdAt: new Date('2023-01-15') },
    { _id: 'client2', name: 'Candy Corner', contactPerson: 'Priya Sharma', phone: '8765432109', whatsapp: '8765432109', email: 'priya@candycorner.com', address: '456 Sugar Lane, Delhi', createdAt: new Date('2023-02-20') },
    { _id: 'client3', name: 'Chocolate Haven', contactPerson: 'Raj Patel', phone: '7654321098', whatsapp: '7654321098', email: 'raj@chocolatehaven.com', address: '789 Cocoa Avenue, Bangalore', createdAt: new Date('2023-03-10') }
  ],

  branches: [
    { _id: 'branch1', clientId: 'client1', branchName: 'Sweet Delights - North', address: '123 North Street, Mumbai', contactPerson: 'Sarah Johnson', phone: '9876543211', createdAt: new Date('2023-01-20') },
    { _id: 'branch2', clientId: 'client1', branchName: 'Sweet Delights - South', address: '456 South Road, Mumbai', contactPerson: 'Mike Wilson', phone: '9876543212', createdAt: new Date('2023-01-25') },
    { _id: 'branch3', clientId: 'client2', branchName: 'Candy Corner - Main', address: '789 Main Street, Delhi', contactPerson: 'Anita Desai', phone: '8765432110', createdAt: new Date('2023-02-22') },
    { _id: 'branch4', clientId: 'client3', branchName: 'Chocolate Haven - Central', address: '101 Central Avenue, Bangalore', contactPerson: 'Vikram Singh', phone: '7654321099', createdAt: new Date('2023-03-15') }
  ],

  materials: [
    { _id: 'material1', name: 'Cardboard Sheet', description: 'High-quality corrugated cardboard sheets', unit: 'sheet', currentStock: 500, lowStockThreshold: 100, createdAt: new Date('2023-01-10') },
    { _id: 'material2', name: 'Kraft Paper', description: 'Brown kraft paper for box lining', unit: 'roll', currentStock: 25, lowStockThreshold: 5, createdAt: new Date('2023-01-12') },
    { _id: 'material3', name: 'Adhesive', description: 'Industrial-grade adhesive for box assembly', unit: 'liter', currentStock: 30, lowStockThreshold: 10, createdAt: new Date('2023-01-15') },
    { _id: 'material4', name: 'Colored Paper', description: 'Decorative colored paper for box finishing', unit: 'sheet', currentStock: 200, lowStockThreshold: 50, createdAt: new Date('2023-02-05') }
  ],

  products: [
    { _id: 'product1', name: 'Small Sweet Box', description: 'Small box for individual sweets', dimensions: { length: 10, width: 10, height: 5 }, specifications: 'Single compartment', createdAt: new Date('2023-01-20') },
    { _id: 'product2', name: 'Medium Gift Box', description: 'Medium-sized box for gift packaging', dimensions: { length: 20, width: 15, height: 10 }, specifications: 'Multiple compartments', createdAt: new Date('2023-01-25') },
    { _id: 'product3', name: 'Large Display Box', description: 'Large box for store displays', dimensions: { length: 30, width: 25, height: 15 }, specifications: 'Reinforced structure', createdAt: new Date('2023-02-05') },
    { _id: 'product4', name: 'Assorted Box', description: 'Box with compartments for assorted sweets', dimensions: { length: 25, width: 25, height: 8 }, specifications: '9 compartments', createdAt: new Date('2023-02-15') }
  ],

  orders: [
    { _id: 'order1', clientId: 'client1', branchId: 'branch1', orderDate: new Date('2023-04-10'), deliveryDate: new Date('2023-04-20'), status: 'Completed', totalAmount: 1500, notes: 'Urgent order', createdAt: new Date('2023-04-10'), clientName: 'Sweet Delights' },
    { _id: 'order2', clientId: 'client2', branchId: 'branch3', orderDate: new Date('2023-04-15'), deliveryDate: new Date('2023-04-25'), status: 'Processing', totalAmount: 2200, notes: 'Special packaging', createdAt: new Date('2023-04-15'), clientName: 'Candy Corner' },
    { _id: 'order3', clientId: 'client3', branchId: 'branch4', orderDate: new Date('2023-04-20'), deliveryDate: new Date('2023-04-30'), status: 'Pending', totalAmount: 3000, notes: 'Design approval', createdAt: new Date('2023-04-20'), clientName: 'Chocolate Haven' },
    { _id: 'order4', clientId: 'client1', branchId: 'branch2', orderDate: new Date('2023-04-22'), deliveryDate: new Date('2023-05-02'), status: 'Processing', totalAmount: 1800, notes: 'Monthly order', createdAt: new Date('2023-04-22'), clientName: 'Sweet Delights' },
    { _id: 'order5', clientId: 'client3', branchId: 'branch4', orderDate: new Date('2023-04-25'), deliveryDate: new Date('2023-05-05'), status: 'Pending', totalAmount: 2500, notes: 'Custom design', createdAt: new Date('2023-04-25'), clientName: 'Chocolate Haven' }
  ],

  orderItems: [
    { _id: 'oi1', orderId: 'order1', productId: 'product1', quantity: 50, unitPrice: 15, totalPrice: 750, specifications: 'Standard', productName: 'Small Sweet Box', createdAt: new Date('2023-04-10') },
    { _id: 'oi2', orderId: 'order1', productId: 'product2', quantity: 20, unitPrice: 35, totalPrice: 700, specifications: 'Gold trim', productName: 'Medium Gift Box', createdAt: new Date('2023-04-10') },
    { _id: 'oi3', orderId: 'order2', productId: 'product1', quantity: 60, unitPrice: 18, totalPrice: 1080, specifications: 'Logo printing', productName: 'Small Sweet Box', createdAt: new Date('2023-04-15') },
    { _id: 'oi4', orderId: 'order2', productId: 'product2', quantity: 28, unitPrice: 40, totalPrice: 1120, specifications: 'Premium finish', productName: 'Medium Gift Box', createdAt: new Date('2023-04-15') },
    { _id: 'oi5', orderId: 'order3', productId: 'product4', quantity: 50, unitPrice: 55, totalPrice: 2750, specifications: 'Transparent lid', productName: 'Assorted Box', createdAt: new Date('2023-04-20') }
  ],

  payments: [
    { _id: 'payment1', clientId: 'client1', amount: 1000, date: new Date('2023-04-12'), paymentMethod: 'Bank Transfer', referenceNumber: 'BT12345', status: 'Completed', notes: 'Advance', clientName: 'Sweet Delights', createdAt: new Date('2023-04-12') },
    { _id: 'payment2', clientId: 'client1', amount: 500, date: new Date('2023-04-22'), paymentMethod: 'UPI', referenceNumber: 'UPI67890', status: 'Completed', notes: 'Final', clientName: 'Sweet Delights', createdAt: new Date('2023-04-22') },
    { _id: 'payment3', clientId: 'client2', amount: 1100, date: new Date('2023-04-16'), paymentMethod: 'Check', referenceNumber: 'CHK54321', status: 'Pending', notes: 'Advance', clientName: 'Candy Corner', createdAt: new Date('2023-04-16') },
    { _id: 'payment4', clientId: 'client3', amount: 1500, date: new Date('2023-04-21'), paymentMethod: 'Bank Transfer', referenceNumber: 'BT67890', status: 'Completed', notes: 'Advance', clientName: 'Chocolate Haven', createdAt: new Date('2023-04-21') }
  ],

  invoices: [
    { _id: 'invoice1', orderId: 'order1', invoiceNumber: 'INV-2023-001', invoiceDate: new Date('2023-04-10'), dueDate: new Date('2023-04-25'), amount: 1500, status: 'Paid', clientName: 'Sweet Delights', createdAt: new Date('2023-04-10') },
    { _id: 'invoice2', orderId: 'order2', invoiceNumber: 'INV-2023-002', invoiceDate: new Date('2023-04-15'), dueDate: new Date('2023-04-30'), amount: 2200, status: 'Pending', clientName: 'Candy Corner', createdAt: new Date('2023-04-15') },
    { _id: 'invoice3', orderId: 'order3', invoiceNumber: 'INV-2023-003', invoiceDate: new Date('2023-04-20'), dueDate: new Date('2023-05-05'), amount: 3000, status: 'Pending', clientName: 'Chocolate Haven', createdAt: new Date('2023-04-20') },
    { _id: 'invoice4', orderId: 'order4', invoiceNumber: 'INV-2023-004', invoiceDate: new Date('2023-04-22'), dueDate: new Date('2023-05-07'), amount: 1800, status: 'Pending', clientName: 'Sweet Delights', createdAt: new Date('2023-04-22') }
  ],

  shipments: [
    { _id: 'ship1', orderId: 'order1', shipmentDate: new Date('2023-04-19'), trackingNumber: 'SHP-2023-001', status: 'Delivered', deliveryNotes: 'Main entrance', clientName: 'Sweet Delights', createdAt: new Date('2023-04-19') },
    { _id: 'ship2', orderId: 'order2', shipmentDate: new Date('2023-04-24'), trackingNumber: 'SHP-2023-002', status: 'In Transit', deliveryNotes: 'Evening delivery', clientName: 'Candy Corner', createdAt: new Date('2023-04-24') },
    { _id: 'ship3', orderId: 'order4', shipmentDate: new Date('2023-05-01'), trackingNumber: 'SHP-2023-003', status: 'Pending', deliveryNotes: 'Dispatch ready', clientName: 'Sweet Delights', createdAt: new Date('2023-05-01') }
  ]
};

module.exports = mockData;
