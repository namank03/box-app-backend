const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/simpleConfig');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./config/swagger');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const branchRoutes = require('./routes/branchRoutes');
const materialRoutes = require('./routes/materialRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN.split(','),
  credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Box Manufacturing API Documentation'
}));

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', orderItemRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`, {
      port: config.PORT,
      environment: config.NODE_ENV,
      logLevel: config.LOG_LEVEL,
      timestamp: new Date().toISOString()
    });
  });
}

module.exports = app;
