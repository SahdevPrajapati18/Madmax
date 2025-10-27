import { config as dotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcEnvPath = join(__dirname, '..', '.env');
dotenv({ path: srcEnvPath, override: false });

const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    // IMPORTANT: These should be different!
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',   // Backend API URL
    RABBITMQ_URI: process.env.RABBITMQ_URI,
};

// Debug: Log configuration status
console.log('🔧 Config loaded:', {
    hasMongoURI: !!_config.MONGO_URI,
    hasJwtSecret: !!_config.JWT_SECRET,
    hasClientId: !!_config.CLIENT_ID,
    hasClientSecret: !!_config.CLIENT_SECRET,
    frontendUrl: _config.FRONTEND_URL,
    backendUrl: _config.BACKEND_URL,
    hasRabbitMQ: !!_config.RABBITMQ_URI,
});

// Validate Google OAuth configuration
if (!_config.CLIENT_ID || !_config.CLIENT_SECRET) {
    console.error('❌ Google OAuth configuration incomplete!');
    console.error('   - CLIENT_ID:', _config.CLIENT_ID ? '✓ Set' : '✗ Missing');
    console.error('   - CLIENT_SECRET:', _config.CLIENT_SECRET ? '✓ Set' : '✗ Missing');
}

export default _config;