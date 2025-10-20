const Client = require('../models/Client');
const { NotFoundError, DatabaseError } = require('../errors');
const { getPaginationParams, createPaginationResponse, parsePaginationQuery } = require('../utils/pagination');

// Get all clients
exports.getClients = async (req, res, next) => {
  try {
    const { page, limit, sort } = parsePaginationQuery(req.query);

    // Get total count for pagination
    const total = await Client.countDocuments();

    // Calculate pagination parameters
    const pagination = getPaginationParams(page, limit, total);

    // Get paginated clients
    const clients = await Client.find()
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.pageSize);

    const response = createPaginationResponse(clients, pagination);
    res.json(response);
  } catch (error) {
    next(new DatabaseError('Failed to fetch clients'));
  }
};

// Get single client
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return next(new NotFoundError('Client'));
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    next(new DatabaseError('Failed to fetch client'));
  }
};

// Create client
exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);

    res.status(201).json({
      success: true,
      data: newClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get client branches
exports.getClientBranches = async (req, res) => {
  try {
    const Branch = require('../models/Branch');
    const clientId = req.params.id;
    const branches = await Branch.find({ clientId });

    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get client orders
exports.getClientOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const clientId = req.params.id;
    const { page, limit, sort } = parsePaginationQuery(req.query);

    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return next(new NotFoundError('Client'));
    }

    // Get total count for pagination
    const total = await Order.countDocuments({ clientId });

    // Calculate pagination parameters
    const pagination = getPaginationParams(page, limit, total);

    // Get paginated orders with population
    const orders = await Order.find({ clientId })
      .populate('clientId', 'name email phone')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.pageSize);

    const response = createPaginationResponse(orders, pagination);
    res.json(response);
  } catch (error) {
    next(new DatabaseError('Failed to fetch client orders'));
  }
};

// Get client payments
exports.getClientPayments = (req, res) => {
  const mockData = require('../utils/mockData');
  const clientId = req.params.id;
  const payments = mockData.payments.filter(p => p.clientId.toString() === clientId);

  res.json({
    success: true,
    count: payments.length,
    data: payments
  });
};
