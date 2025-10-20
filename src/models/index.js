// Export all individual models
const Client = require('./Client');
const Branch = require('./Branch');
const Material = require('./Material');
const Product = require('./Product');
const Order = require('./Order');
const Invoice = require('./Invoice');
const Payment = require('./Payment');
const Shipment = require('./Shipment');

module.exports = {
  Client,
  Branch,
  Material,
  Product,
  Order,
  Invoice,
  Payment,
  Shipment
};
