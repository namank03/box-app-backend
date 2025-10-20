# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js REST API backend for a box manufacturing business management system. It provides a comprehensive API for managing clients, inventory, orders, payments, shipments, and business analytics.

**Technology Stack:**
- **Backend**: Express.js v5.1.0 with CommonJS modules
- **Database**: MongoDB with Mongoose ODM v8.19.1
- **Testing**: Jest v29.7.0 with Supertest for API testing
- **Authentication**: JWT-based (structure in place, implementation incomplete)

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run all tests
npm test

# Run single test file
npm test -- tests/clients.test.js

# Seed database with mock data
npm run seed
```

## Architecture Overview

The application follows MVC pattern with clear separation of concerns:

### Core Structure
- **`/src/controllers/`**: Business logic handlers for each domain entity
- **`/src/models/`**: Mongoose schemas with comprehensive model definitions
- **`/src/routes/`**: Express route definitions following RESTful patterns
- **`/src/middleware/`**: Request processing and validation middleware
- **`/src/config/`**: Database connection and configuration
- **`/src/utils/`**: Utility functions including database seeding

### Key Business Entities
The system manages a complete box manufacturing workflow:
1. **Clients & Branches**: Customer management with multi-location support
2. **Materials**: Raw material inventory with stock tracking
3. **Products**: Box specifications and manufacturing details
4. **Orders**: Complete order lifecycle management
5. **Payments & Invoices**: Financial tracking and billing
6. **Shipments**: Delivery and logistics management
7. **Dashboard**: Business analytics and reporting

### API Design Patterns
- **Endpoint Structure**: `/api/{resource}` with consistent RESTful patterns
- **Response Format**: Standardized `{success, data, count, message}` structure
- **Error Handling**: Global error middleware with environment-aware messages

## Database Configuration

The application uses MongoDB Atlas with automatic fallback to in-memory mock data for development:

- **Connection**: Handled in `/src/config/db.js`
- **Environment Variables**: `MONGO_URI`, `PORT`, `NODE_ENV`
- **Mock Data**: Comprehensive seeding system in `/src/utils/seedDatabase.js`

## Testing Strategy

- **Framework**: Jest with Node.js test environment
- **Test Files**: Located in `/tests/` directory
- **Coverage**: API endpoints for all major entities
- **Test Environment**: Uses `NODE_ENV=test` to avoid server startup during tests

## Development Notes

### CORS Configuration
Frontend origins allowed: `http://localhost:3000`, `http://localhost:5173`

### Environment Setup
Required `.env` variables:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (defaults to 5001)
- `NODE_ENV`: Environment mode (development/production/test)

### Missing Implementations
- Authentication system is structured but not fully implemented
- No code linting/formatting tools configured
- No API documentation (Swagger/OpenAPI)
- No Docker configuration

## Common Development Patterns

When working with this codebase:

1. **Adding New Endpoints**: Follow the existing controller-route pattern
2. **Database Changes**: Update models in `/src/models/index.js` and relevant individual model files
3. **Testing**: Create corresponding test files in `/tests/` using Jest and Supertest
4. **Error Handling**: Use the standardized error response format
5. **Validation**: Implement validation middleware in `/src/middleware/validation.js`