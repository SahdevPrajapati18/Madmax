import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/auth.controller.js';
import * as validationRules from '../middlewares/validation.middleware.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working!' });
});

router.get('/me', authMiddleware.authUserMiddleware, authController.getCurrentUser);
router.post('/register', validationRules.registerUserValidationRules, authController.register);
router.post('/login', validationRules.loginUserValidationRules, authController.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleAuthCallback
);

export default router;