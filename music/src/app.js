import express from 'express';
import musicRoutes from './routes/music.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['https://madmax-nine.vercel.app'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/music', musicRoutes);

export default app;