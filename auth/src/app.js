import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
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
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: `${config.GOOGLE_CALLBACK_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate required profile data
        if (!profile || !profile.id || !profile.emails || !profile.emails.length || !profile.displayName) {
          console.error('Google OAuth: Invalid profile data received:', {
            hasProfile: !!profile,
            hasId: !!profile?.id,
            hasEmails: !!profile?.emails?.length,
            hasDisplayName: !!profile?.displayName
          });
          return done(new Error('Invalid Google profile data'), null);
        }

        // Log successful authentication (without sensitive data)
        console.log('Google OAuth: Profile received for:', profile.emails[0].value);

        // Return profile directly - user creation/lookup is handled in the callback
        return done(null, profile);
      } catch (err) {
        console.error('Google OAuth strategy error:', err);
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

// ✅ OAuth configuration check (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get("/oauth/config", (req, res) => {
    res.json({
      googleOAuth: {
        clientIdConfigured: !!config.CLIENT_ID,
        clientSecretConfigured: !!config.CLIENT_SECRET,
        callbackUrl: `${config.CLIENT_URL}/api/auth/google/callback`,
        clientUrlConfigured: !!config.CLIENT_URL
      },
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// ✅ Error handling for OAuth
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error", error: err.message });
});

export default app;
