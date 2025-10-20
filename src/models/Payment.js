const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
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
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Check', 'Credit Card', 'UPI'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  referenceNumber: {
    type: String,
    default: ''
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
PaymentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate payment number before saving
PaymentSchema.pre('save', function (next) {
  if (!this.paymentNumber) {
    this.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Make paymentNumber optional for validation
PaymentSchema.pre('validate', function (next) {
  if (!this.paymentNumber) {
    this.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
