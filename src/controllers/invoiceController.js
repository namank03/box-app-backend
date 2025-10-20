const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Order = require('../models/Order');

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status')
      .sort({ createdAt: -1 });

    // Add clientName for frontend compatibility
    const invoicesWithClientInfo = invoices.map(invoice => ({
      ...invoice.toObject(),
      clientName: invoice.clientId ? invoice.clientId.name : 'Unknown Client'
    }));

    res.json({
      success: true,
      count: invoicesWithClientInfo.length,
      data: invoicesWithClientInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status items');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const invoiceWithDetails = {
      ...invoice.toObject(),
      clientName: invoice.clientId ? invoice.clientId.name : 'Unknown Client',
      orderDetails: invoice.orderId || {}
    };

    res.json({
      success: true,
      data: invoiceWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientId, clientName, amount, invoiceDate, status, notes, orderId } = req.body;

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

    const invoiceData = {
      clientId,
      clientName: clientName || client.name,
      amount: Number(amount),
      invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
      status: status || 'Pending',
      notes: notes || '',
      orderId: orderId || undefined
    };

    const newInvoice = await Invoice.create(invoiceData);

    // Populate client and order info for response
    await newInvoice.populate('clientId', 'name email phone');
    if (newInvoice.orderId) {
      await newInvoice.populate('orderId', 'orderDate totalAmount status');
    }

    const invoiceWithDetails = {
      ...newInvoice.toObject(),
      clientName: newInvoice.clientId ? newInvoice.clientId.name : 'Unknown Client'
    };

    res.status(201).json({
      success: true,
      data: invoiceWithDetails
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

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { clientId, clientName, amount, invoiceDate, status, notes, orderId } = req.body;

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
    if (amount != null) updateData.amount = Number(amount);
    if (invoiceDate != null) updateData.invoiceDate = new Date(invoiceDate);
    if (status != null) updateData.status = status;
    if (notes != null) updateData.notes = notes;
    // Handle orderId - convert empty string to null
    if (orderId != null) {
      updateData.orderId = orderId === '' || orderId === undefined ? null : orderId;
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
      .populate('orderId', 'orderDate totalAmount status');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const invoiceWithDetails = {
      ...invoice.toObject(),
      clientName: invoice.clientId ? invoice.clientId.name : 'Unknown Client'
    };

    res.json({
      success: true,
      data: invoiceWithDetails
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

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
