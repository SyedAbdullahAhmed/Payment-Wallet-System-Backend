const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Check for AggregateError with cause property
    if (error.name === 'AggregateError') {
      if (error.cause) {
        console.error('🔍 Error cause:', error.cause);
      }
      if (error.errors && error.errors.length === 0) {
        console.error('⚠️ AggregateError with empty errors array detected');
      }
    }
    
    // Log detailed connection info
    const instanceId = error?.connection?.id || error?.connection?.host || 'unknown';
    console.error(`🔍 MongoDB instance: ${instanceId}`);
    
    // Log the full error object for debugging (in development only)
    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
  }
};

// Execute as an async IIFE to allow for proper error handling
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
})();