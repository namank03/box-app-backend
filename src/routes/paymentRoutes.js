const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validation');

// Payment routes
router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.post('/', validatePayment, paymentController.createPayment);
router.put('/:id', validatePayment, paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
