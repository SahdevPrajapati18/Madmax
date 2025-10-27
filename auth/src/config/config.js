import { config as dotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// config.js is in src/config, the project-level src/.env lives at ../.env
const srcEnvPath = join(__dirname, '..', '.env');
dotenv({ path: srcEnvPath, override: false });

const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL || process.env.GOOGLE_CALLBACK_URL,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
};

// Debug: Log configuration status (without exposing sensitive data)
console.log('🔧 Config loaded:', {
    hasMongoURI: !!_config.MONGO_URI,
    hasJwtSecret: !!_config.JWT_SECRET,
    hasClientId: !!_config.CLIENT_ID,
    hasClientSecret: !!_config.CLIENT_SECRET,
    hasClientUrl: !!_config.CLIENT_URL,
    hasRabbitMQ: !!_config.RABBITMQ_URI,
});

if (!_config.CLIENT_ID) {
    console.error('❌ CLIENT_ID is missing from environment variables!');
}

if (!_config.CLIENT_SECRET) {
    console.error('❌ CLIENT_SECRET is missing from environment variables!');
}

// Validate Google OAuth configuration
if (!_config.CLIENT_ID || !_config.CLIENT_SECRET || !_config.CLIENT_URL) {
    console.error('❌ Google OAuth configuration incomplete! Please check CLIENT_ID, CLIENT_SECRET, and CLIENT_URL');
    console.error('   - CLIENT_ID:', _config.CLIENT_ID ? '✓ Set' : '✗ Missing');
    console.error('   - CLIENT_SECRET:', _config.CLIENT_SECRET ? '✓ Set' : '✗ Missing');
    console.error('   - CLIENT_URL:', _config.CLIENT_URL ? '✓ Set' : '✗ Missing');
    console.error('   - Note: CLIENT_URL can be set via CLIENT_URL or GOOGLE_CALLBACK_URL environment variable');
}

export default _config;