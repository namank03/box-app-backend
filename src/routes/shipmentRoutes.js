const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { validateShipment } = require('../middleware/validation');

// Shipment routes
router.get('/', shipmentController.getShipments);
router.get('/:id', shipmentController.getShipment);
router.post('/', validateShipment, shipmentController.createShipment);
router.put('/:id', validateShipment, shipmentController.updateShipment);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
