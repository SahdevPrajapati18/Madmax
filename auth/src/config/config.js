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
    RABBITMQ_URI: process.env.RABBITMQ_URI,
};

// Debug: Log configuration status (without exposing sensitive data)
console.log('🔧 Config loaded:', {
    hasMongoURI: !!_config.MONGO_URI,
    hasJwtSecret: !!_config.JWT_SECRET,
    hasClientId: !!_config.CLIENT_ID,
    hasClientSecret: !!_config.CLIENT_SECRET,
    hasRabbitMQ: !!_config.RABBITMQ_URI,
});

if (!_config.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing from environment variables!');
}

if (!_config.MONGO_URI) {
    console.error('❌ MONGO_URI is missing from environment variables!');
}

export default _config;