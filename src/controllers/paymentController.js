const Payment = require('../models/Payment');
const Client = require('../models/Client');

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('clientId', 'name email phone')
      .sort({ createdAt: -1 });

    // Add clientName for frontend compatibility
    const paymentsWithClientInfo = payments.map(payment => ({
      ...payment.toObject(),
      clientName: payment.clientId ? payment.clientId.name : 'Unknown Client'
    }));

    res.json({
      success: true,
      count: paymentsWithClientInfo.length,
      data: paymentsWithClientInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single payment
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('clientId', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const paymentWithDetails = {
      ...payment.toObject(),
      clientName: payment.clientId ? payment.clientId.name : 'Unknown Client'
    };

    res.json({
      success: true,
      data: paymentWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { clientId, clientName, amount, paymentMethod, status, date, referenceNumber, notes } = req.body;

    // Validation
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
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

    const paymentData = {
      clientId,
      clientName: clientName || client.name,
      amount: Number(amount),
      paymentMethod,
      status: status || 'Pending',
      date: date ? new Date(date) : new Date(),
      referenceNumber: referenceNumber || '',
      notes: notes || ''
    };

    const newPayment = await Payment.create(paymentData);

    // Populate client info for response
    await newPayment.populate('clientId', 'name email phone');

    const paymentWithDetails = {
      ...newPayment.toObject(),
      clientName: newPayment.clientId ? newPayment.clientId.name : 'Unknown Client'
    };

    res.status(201).json({
      success: true,
      data: paymentWithDetails
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

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const { clientId, clientName, amount, paymentMethod, status, date, referenceNumber, notes } = req.body;

    // Validation
    if (amount != null && (isNaN(Number(amount)) || Number(amount) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a non-negative number'
      });
    }

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

    const updateData = {};
    if (clientId != null) updateData.clientId = clientId;
    if (clientName != null) updateData.clientName = clientName;
    if (amount != null) updateData.amount = Number(amount);
    if (paymentMethod != null) updateData.paymentMethod = paymentMethod;
    if (status != null) updateData.status = status;
    if (date != null) updateData.date = new Date(date);
    if (referenceNumber != null) updateData.referenceNumber = referenceNumber;
    if (notes != null) updateData.notes = notes;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const paymentWithDetails = {
      ...payment.toObject(),
      clientName: payment.clientId ? payment.clientId.name : 'Unknown Client'
    };

    res.json({
      success: true,
      data: paymentWithDetails
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

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
