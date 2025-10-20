const mockData = require('../utils/mockData');
const mongoose = require('mongoose');

// Get items for a specific order
exports.getItemsByOrder = (req, res) => {
  const { id: orderId } = req.params;
  const items = mockData.orderItems
    .filter(i => i.orderId.toString() === orderId.toString())
    .map(item => {
      const product = mockData.products.find(p => p._id.toString() === item.productId.toString());
      return { ...item, productName: product ? product.name : 'Unknown Product' };
    });
  res.json({ success: true, count: items.length, data: items });
};

// Add a new item to an order
exports.addItemToOrder = (req, res) => {
  const { id: orderId } = req.params;
  const { productId, quantity, unitPrice, specifications } = req.body || {};

  if (!productId || isNaN(Number(quantity)) || isNaN(Number(unitPrice))) {
    return res.status(400).json({ success: false, message: 'productId, quantity, and unitPrice are required' });
  }

  const newItem = {
    _id: new mongoose.Types.ObjectId().toString(),
    orderId,
    productId,
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    totalPrice: Number(quantity) * Number(unitPrice),
    specifications: specifications || '',
    createdAt: new Date()
  };
  mockData.orderItems.push(newItem);
  res.status(201).json({ success: true, data: newItem });
};

// Update an order item
exports.updateItem = (req, res) => {
  const { itemId } = req.params;
  const index = mockData.orderItems.findIndex(i => i._id.toString() === itemId.toString());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order item not found' });
  }

  const { quantity, unitPrice, specifications } = req.body || {};
  const updated = { ...mockData.orderItems[index] };
  if (quantity != null) updated.quantity = Number(quantity);
  if (unitPrice != null) updated.unitPrice = Number(unitPrice);
  if (specifications != null) updated.specifications = specifications;
  updated.totalPrice = Number(updated.quantity) * Number(updated.unitPrice);

  mockData.orderItems[index] = updated;
  res.json({ success: true, data: updated });
};

// Delete an order item
exports.deleteItem = (req, res) => {
  const { itemId } = req.params;
  const index = mockData.orderItems.findIndex(i => i._id.toString() === itemId.toString());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order item not found' });
  }
  mockData.orderItems.splice(index, 1);
  res.json({ success: true, data: {} });
};
