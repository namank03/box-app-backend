const Shipment = require('../models/Shipment');
const Client = require('../models/Client');
const Order = require('../models/Order');

// Get all shipments
exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status')
      .sort({ createdAt: -1 });

    // Add clientName for frontend compatibility
    const shipmentsWithClientInfo = shipments.map(shipment => ({
      ...shipment.toObject(),
      clientName: shipment.clientId ? shipment.clientId.name : 'Unknown Client'
    }));

    res.json({
      success: true,
      count: shipmentsWithClientInfo.length,
      data: shipmentsWithClientInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single shipment
exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status items');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipmentWithDetails = {
      ...shipment.toObject(),
      clientName: shipment.clientId ? shipment.clientId.name : 'Unknown Client',
      orderDetails: shipment.orderId || {}
    };

    res.json({
      success: true,
      data: shipmentWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create shipment
exports.createShipment = async (req, res) => {
  try {
    const { clientId, clientName, trackingNumber, shipmentDate, status, orderId, estimatedDelivery, notes } = req.body;

    // Validation
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: 'Tracking number is required'
      });
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(400).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Verify order exists if provided
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({
          success: false,
          message: 'Order not found'
        });
      }
    }

    const shipmentData = {
      clientId,
      clientName: clientName || client.name,
      trackingNumber,
      shipmentDate: shipmentDate ? new Date(shipmentDate) : new Date(),
      status: status || 'Pending',
      orderId: orderId || undefined,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      notes: notes || ''
    };

    const newShipment = await Shipment.create(shipmentData);

    // Populate client and order info for response
    await newShipment.populate('clientId', 'name email phone');
    if (newShipment.orderId) {
      await newShipment.populate('orderId', 'orderDate totalAmount status');
    }

    const shipmentWithDetails = {
      ...newShipment.toObject(),
      clientName: newShipment.clientId ? newShipment.clientId.name : 'Unknown Client'
    };

    res.status(201).json({
      success: true,
      data: shipmentWithDetails
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update shipment
exports.updateShipment = async (req, res) => {
  try {
    const { clientId, clientName, trackingNumber, shipmentDate, status, orderId, estimatedDelivery, notes } = req.body;

    // Validate client if provided
    if (clientId) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(400).json({
          success: false,
          message: 'Client not found'
        });
      }
    }

    // Validate order if provided
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({
          success: false,
          message: 'Order not found'
        });
      }
    }

    const updateData = {};
    if (clientId != null) updateData.clientId = clientId;
    if (clientName != null) updateData.clientName = clientName;
    if (trackingNumber != null) updateData.trackingNumber = trackingNumber;
    if (shipmentDate != null) updateData.shipmentDate = new Date(shipmentDate);
    if (status != null) updateData.status = status;
    if (orderId != null) updateData.orderId = orderId;
    if (estimatedDelivery != null) updateData.estimatedDelivery = new Date(estimatedDelivery);
    if (notes != null) updateData.notes = notes;

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipmentWithDetails = {
      ...shipment.toObject(),
      clientName: shipment.clientId ? shipment.clientId.name : 'Unknown Client'
    };

    res.json({
      success: true,
      data: shipmentWithDetails
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete shipment
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
