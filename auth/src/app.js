import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


dotenv.config();


const app = express();

app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,    
    callbackURL: '/api/auth/google/callback'
},(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));



app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


export default app;
