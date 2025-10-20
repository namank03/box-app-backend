const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs', 'pcs', 'm', 'sqm', 'liters', 'sheets', 'rolls']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    validate: {
      validator: v => v >= 0,
      message: 'Price must be non-negative'
    }
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
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
MaterialSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update status based on currentStock before saving
MaterialSchema.pre('save', function (next) {
  if (this.currentStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.currentStock <= this.lowStockThreshold) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

module.exports = mongoose.model('Material', MaterialSchema);
