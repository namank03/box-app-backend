// Validation middleware for request body validation

const validateClient = (req, res, next) => {
  const { name, email, phone, address, city, state, zipCode } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Name is required');
  }

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email format is invalid');
  }

  if (!phone || !phone.trim()) {
    errors.push('Phone is required');
  }

  if (!address || !address.trim()) {
    errors.push('Address is required');
  }

  if (!city || !city.trim()) {
    errors.push('City is required');
  }

  if (!state || !state.trim()) {
    errors.push('State is required');
  }

  if (!zipCode || !zipCode.trim()) {
    errors.push('Zip code is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateMaterial = (req, res, next) => {
  const { name, unit, currentStock, lowStockThreshold } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Name is required');
  }

  if (!unit || !unit.trim()) {
    errors.push('Unit is required');
  } else if (!['kg', 'lbs', 'pcs', 'm', 'sqm', 'liters', 'sheets', 'rolls'].includes(unit)) {
    errors.push('Unit must be one of: kg, lbs, pcs, m, sqm, liters, sheets, rolls');
  }

  if (currentStock !== undefined && (isNaN(Number(currentStock)) || Number(currentStock) < 0)) {
    errors.push('Current stock must be a non-negative number');
  }

  if (lowStockThreshold !== undefined && (isNaN(Number(lowStockThreshold)) || Number(lowStockThreshold) < 0)) {
    errors.push('Low stock threshold must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, description, price, materials } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Name is required');
  }

  if (!description || !description.trim()) {
    errors.push('Description is required');
  }

  if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
    errors.push('Price must be a non-negative number');
  }

  if (materials && Array.isArray(materials)) {
    materials.forEach((material, index) => {
      if (!material.materialId) {
        errors.push(`Material ${index + 1}: materialId is required`);
      }
      if (!material.quantity || isNaN(Number(material.quantity)) || Number(material.quantity) <= 0) {
        errors.push(`Material ${index + 1}: quantity must be a positive number`);
      }
      if (!material.unit || !material.unit.trim()) {
        errors.push(`Material ${index + 1}: unit is required`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { clientId, deliveryDate, items } = req.body;
  const errors = [];

  if (!clientId) {
    errors.push('Client ID is required');
  }

  if (!deliveryDate) {
    errors.push('Delivery date is required');
  } else if (isNaN(Date.parse(deliveryDate))) {
    errors.push('Delivery date must be a valid date');
  }

  if (items && Array.isArray(items)) {
    items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: productId is required`);
      }
      if (item.quantity === undefined || item.quantity === null || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        errors.push(`Item ${index + 1}: quantity must be a positive number`);
      }
      if (item.unitPrice === undefined || item.unitPrice === null || isNaN(Number(item.unitPrice)) || Number(item.unitPrice) < 0) {
        errors.push(`Item ${index + 1}: unitPrice must be a non-negative number`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validatePayment = (req, res, next) => {
  const { clientId, amount, paymentMethod } = req.body;
  const errors = [];

  if (!clientId) {
    errors.push('Client ID is required');
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    errors.push('Amount must be a non-negative number');
  }

  if (!paymentMethod) {
    errors.push('Payment method is required');
  } else if (!['Bank Transfer', 'Cash', 'Check', 'Credit Card', 'UPI'].includes(paymentMethod)) {
    errors.push('Payment method must be one of: Bank Transfer, Cash, Check, Credit Card, UPI');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateInvoice = (req, res, next) => {
  const { clientId, amount, invoiceDate } = req.body;
  const errors = [];

  if (!clientId) {
    errors.push('Client ID is required');
  }

  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    errors.push('Amount must be a non-negative number');
  }

  if (invoiceDate && isNaN(Date.parse(invoiceDate))) {
    errors.push('Invoice date must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateShipment = (req, res, next) => {
  const { clientId, trackingNumber } = req.body;
  const errors = [];

  if (!clientId) {
    errors.push('Client ID is required');
  }

  if (!trackingNumber || !trackingNumber.trim()) {
    errors.push('Tracking number is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

const validateBranch = (req, res, next) => {
  const { name, location, clientId } = req.body;
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Branch name is required');
  }

  if (!location || !location.trim()) {
    errors.push('Location is required');
  }

  if (!clientId) {
    errors.push('Client ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      error: errors.join(', ')
    });
  }

  next();
};

module.exports = {
  validateClient,
  validateMaterial,
  validateProduct,
  validateOrder,
  validatePayment,
  validateInvoice,
  validateShipment,
  validateBranch
};
