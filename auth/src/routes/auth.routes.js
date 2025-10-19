import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';
import * as validationRules from '../middlewares/validation.middleware.js';

const router = express.Router();

router.post('/register', validationRules.registerUserValidationRules, authController.register);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleAuthCallback
);

export default router;