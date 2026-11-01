import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding_wishcraft';
  const isProduction = process.env.NODE_ENV === 'production';

  // Deployment sanity check
  if (isProduction && (!process.env.MONGO_URI || mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost'))) {
    console.error(`
🚨 CRITICAL DEPLOYMENT CONFIGURATION WARNING:
   The server is running in PRODUCTION mode, but MONGO_URI is not set to a remote MongoDB Atlas database!
   Current URI: ${mongoURI}
   👉 Add MONGO_URI=mongodb+srv://... in your hosting provider's Environment Variables dashboard (Render / Vercel / Railway).
    `);
  }

  // Connection event listeners
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected. Awaiting reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✨  MongoDB successfully reconnected.');
  });

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✨ MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`
❌ MongoDB Connection Failed: ${error.message}
═════════════════════════════════════════════════════════════════════
👉 DEPLOYMENT TROUBLESHOOTING CHECKLIST:
   1. MongoDB Atlas Network Access: Have you added 0.0.0.0/0 ("Allow access from anywhere")
      under Network Access in MongoDB Atlas? Cloud servers (Render/Vercel) require this.
   2. Environment Variables: Did you set MONGO_URI in your deployment settings?
   3. Special Characters: If your MongoDB password has special characters (@, #, %, etc.),
      they must be URL-encoded (e.g. '@' becomes '%40').
   4. Database Name: Ensure your URI includes the database name:
      mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/wedding_wishcraft?retryWrites=true&w=majority
═════════════════════════════════════════════════════════════════════
    `);
    console.log('ℹ️  Server running in resilient mode. Database queries will resume once MongoDB is connected.');
    return null;
  }
};

export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};
