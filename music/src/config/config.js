import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const _config = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/music',
    JWT_SECRET: process.env.JWT_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
}

// Validate required environment variables
if (!_config.SUPABASE_URL || !_config.SUPABASE_API_KEY) {
    console.error('❌ Missing required environment variables:');
    if (!_config.SUPABASE_URL) console.error('   - SUPABASE_URL is required');
    if (!_config.SUPABASE_API_KEY) console.error('   - SUPABASE_API_KEY is required');
    console.error('📖 See SUPABASE_SETUP.md for configuration instructions');
}

if (!_config.JWT_SECRET) {
    console.error('❌ Missing JWT_SECRET environment variable');
    console.error('   Add JWT_SECRET to your .env file');
    console.error('   Example: JWT_SECRET=your-super-secret-jwt-key-here');
    process.exit(1); // Exit the process if JWT_SECRET is missing
}

export default Object.freeze(_config);