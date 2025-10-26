import { config as dotenvConfig } from 'dotenv';
dotenvConfig();


const _config = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/music',
    JWT_SECRET: process.env.JWT_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,

}


export default Object.freeze(_config);