import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://madmax-production.up.railway.app",
      "https://madmax-nine.vercel.app",
      "http://localhost:5173", // optional for local dev
    ],
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ✅ Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // You can handle user creation or lookup here
        // For now, returning profile directly
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
app.use(passport.initialize());

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Health check (for Railway / ECS)
app.get("/health", (req, res) => res.status(200).send("OK"));

// ✅ Error handling for OAuth
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error", error: err.message });
});

export default app;
