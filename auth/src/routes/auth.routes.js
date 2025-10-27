import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';
import * as validationRules from '../middlewares/validation.middleware.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import config from '../config/config.js';

router.get('/me', authMiddleware.authUserMiddleware, authController.getCurrentUser);
router.post('/register', validationRules.registerUserValidationRules, authController.register);
router.post('/login', validationRules.loginUserValidationRules, authController.login);
// router.post('/logout', authController.logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.CLIENT_URL || 'http://localhost:5173'}?error=auth_failed`
    }),
    authController.googleAuthCallback
);

export default router;