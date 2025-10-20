const express = require('express');
const router = express.Router({ mergeParams: true });
const orderItemController = require('../controllers/orderItemController');

// Nested routes under /orders/:id/items
router.get('/orders/:id/items', orderItemController.getItemsByOrder);
router.post('/orders/:id/items', orderItemController.addItemToOrder);

// Item-level routes (flat)
router.put('/order-items/:itemId', orderItemController.updateItem);
router.delete('/order-items/:itemId', orderItemController.deleteItem);

module.exports = router;
