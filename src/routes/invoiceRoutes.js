const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { validateInvoice } = require('../middleware/validation');

// Invoice routes
router.get('/', invoiceController.getInvoices);
router.get('/:id', invoiceController.getInvoice);
router.post('/', validateInvoice, invoiceController.createInvoice);
router.put('/:id', validateInvoice, invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
