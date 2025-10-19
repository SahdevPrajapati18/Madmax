import mongoose from 'mongoose';
import config from '../config/config.js';

const MONGO_URI = config.MONGO_URI;



async function connectDB() {
  if (!MONGO_URI) {
    const err = new Error('MONGO_URI is not defined in environment');
    console.error('❌', err.message);
    throw err;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }
}

export default connectDB;
