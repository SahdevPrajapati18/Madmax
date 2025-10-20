import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Atlas connection successful!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB Atlas connection failed:", err);
    process.exit(1);
  }
};

testConnection();
