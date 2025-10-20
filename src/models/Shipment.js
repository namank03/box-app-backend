const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  shipmentNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  trackingNumber: {
    type: String,
    required: true
  },
  shipmentDate: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered'],
    default: 'Pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ShipmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate shipment number before saving
ShipmentSchema.pre('save', function (next) {
  if (!this.shipmentNumber) {
    this.shipmentNumber = `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Make shipmentNumber optional for validation
ShipmentSchema.pre('validate', function (next) {
  if (!this.shipmentNumber) {
    this.shipmentNumber = `SHIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
