import mongoose from 'mongoose';
import config from '../config/config.js';
// import dotenv from 'dotenv';

async function connectDB(params) {
    try{
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ MongoDB Atlas connected successfully');
    }catch(err){
        console.error('❌ MongoDB connection failed:', err.message);
    }
}

export default connectDB;