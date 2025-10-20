const Joi = require('joi');

// Environment variable schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .default(5001)
    .min(1000)
    .max(65535),

  MONGODB_URI: Joi.string()
    .required()
    .uri()
    .when('NODE_ENV', {
      is: 'test',
      then: Joi.allow(''),
      otherwise: Joi.required()
    }),

  JWT_SECRET: Joi.string()
    .default('your-super-secret-jwt-key-change-in-production')
    .min(32),

  JWT_EXPIRE: Joi.string()
    .default('30d'),

  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000,http://localhost:5173'),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(900000), // 15 minutes

  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100),

  // Pagination defaults
  DEFAULT_PAGE_SIZE: Joi.number()
    .default(10)
    .min(1)
    .max(100),

  MAX_PAGE_SIZE: Joi.number()
    .default(100)
    .min(1)
    .max(1000)
}).unknown(); // Allow unknown environment variables

// Validate environment variables
const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    stripUnknown: true,
    convert: true
  });

  if (error) {
    console.error('Environment validation failed:', error.details.map(detail => detail.message));
    throw new Error(`Environment validation failed: ${error.details.map(detail => detail.message).join(', ')}`);
  }

  console.log('Environment validation successful:', {
    environment: value.NODE_ENV,
    port: value.PORT,
    logLevel: value.LOG_LEVEL
  });

  return value;
};

// Export validated config
const config = validateEnv();

module.exports = config;