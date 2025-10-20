const Order = require('../models/Order');
const Client = require('../models/Client');
const Product = require('../models/Product');

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('clientId', 'name email phone')
      .populate('items.productId') // Populate full product details for each item
      .sort({ createdAt: -1 });

    // Add clientName and transform items to have product object for frontend compatibility
    const ordersWithClientInfo = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        clientName: order.clientId ? order.clientId.name : 'Unknown Client',
        // Transform items to have 'product' property instead of 'productId' for frontend
        items: orderObj.items.map(item => ({
          ...item,
          product: item.productId // Rename productId to product
        }))
      };
    });

    res.json({
      success: true,
      count: ordersWithClientInfo.length,
      data: ordersWithClientInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('clientId', 'name email phone')
      .populate('items.productId'); // Populate product details

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderObj = order.toObject();
    const orderWithDetails = {
      ...orderObj,
      clientName: order.clientId ? order.clientId.name : 'Unknown Client',
      // Transform items to have 'product' property for frontend compatibility
      items: orderObj.items.map(item => ({
        ...item,
        product: item.productId
      }))
    };

    res.json({
      success: true,
      data: orderWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, ...orderData } = req.body;

    // Validation
    if (!orderData.clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID is required'
      });
    }

    if (!orderData.deliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Delivery date is required'
      });
    }

    // Verify client exists
    const client = await Client.findById(orderData.clientId);
    if (!client) {
      return res.status(400).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Validate and enhance items if provided
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.productId || !item.quantity || !item.unitPrice) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have productId, quantity, and unitPrice'
          });
        }

        // Verify product exists and get product name
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        // Add product name and calculate total price
        item.productName = product.name;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    }

    const order = new Order({
      ...orderData,
      items: items || []
    });

    const newOrder = await order.save();

    // Populate client info and product details for response
    await newOrder.populate('clientId', 'name email phone');
    await newOrder.populate('items.productId');

    const orderObj = newOrder.toObject();
    const orderWithDetails = {
      ...orderObj,
      clientName: newOrder.clientId ? newOrder.clientId.name : 'Unknown Client',
      // Transform items to have 'product' property for frontend immediately
      items: orderObj.items.map(item => ({
        ...item,
        product: item.productId
      }))
    };

    res.status(201).json({
      success: true,
      data: orderWithDetails
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

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { items, ...orderData } = req.body;

    // Validate client if provided
    if (orderData.clientId) {
      const client = await Client.findById(orderData.clientId);
      if (!client) {
        return res.status(400).json({
          success: false,
          message: 'Client not found'
        });
      }
    }

    // Validate and enhance items if provided
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.productId || !item.quantity || !item.unitPrice) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have productId, quantity, and unitPrice'
          });
        }

        // Verify product exists and get product name
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        // Add product name and calculate total price
        item.productName = product.name;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    }

    const updateData = { ...orderData };
    if (items) {
      updateData.items = items;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('clientId', 'name email phone')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const orderObj = order.toObject();
    const orderWithDetails = {
      ...orderObj,
      clientName: order.clientId ? order.clientId.name : 'Unknown Client',
      // Transform items to have 'product' property for frontend
      items: orderObj.items.map(item => ({
        ...item,
        product: item.productId
      }))
    };

    res.json({
      success: true,
      data: orderWithDetails
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

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
