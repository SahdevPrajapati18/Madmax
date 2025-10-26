import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

// ✅ Initialize app first
const app = express();

// ✅ Basic middlewares
app.use(
  cors({
    origin: ["https://madmax-production.up.railway.app", "https://madmax-nine.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Passport setup AFTER dotenv loads
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
app.use(passport.initialize());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Health check route for ECS/ALB
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default app;
