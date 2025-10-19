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
};

export default _config;