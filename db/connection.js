const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('⚠️ Please define the MONGODB_URI environment variable');
}

// let isConnected = false; // To prevent multiple connections

const connectDB = () => {
  // if (isConnected) {
  //   console.log('✅ MongoDB already connected');
  //   return;
  // }

  mongoose
    .connect(MONGODB_URI)
    .then((conn) => {
      // isConnected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);

      // Attempt to log instance ID if available
      const instanceId = error?.connection?.id || error?.connection?.host || 'unknown';
      console.error(`🔍 MongoDB instance: ${instanceId}`);

      process.exit(1);
    });
};

connectDB();
