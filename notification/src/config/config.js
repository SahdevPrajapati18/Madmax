import { config as dotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

dotenv();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);      

const _config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    RABBITMQ_URI: process.env.RABBITMQ_URI,
}

export default Object.freeze(_config);