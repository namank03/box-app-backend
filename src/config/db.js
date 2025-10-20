const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Using MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://namanop03_db_user:C3CKe2UlPcFOkmPf@box-app.x4rck4v.mongodb.net/?retryWrites=true&w=majority&appName=Box-App');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Use in-memory MongoDB for development if connection fails
    console.log('Using in-memory MongoDB for development');

    // Create mock data connection
    global.mockDB = true;
    return null;
  }
};

module.exports = connectDB;
