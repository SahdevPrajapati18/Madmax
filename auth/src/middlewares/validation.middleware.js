import { body, validationResult } from 'express-validator';
import userModel from '../models/user.model.js';

async function validate(req, res, next) {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: errors.array()[0].msg,
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }
        
        next();
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({ 
            message: 'Internal server error during validation',
            error: error.message 
        });
    }
}

// Custom validator for checking email uniqueness
const isEmailUnique = async (email) => {
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new Error('Email is already registered');
    }
    return true;
};

// Custom validator for password strength
const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!hasUppercase) {
        throw new Error('Password must contain at least one uppercase letter');
    }
    if (!hasLowercase) {
        throw new Error('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
        throw new Error('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
        throw new Error('Password must contain at least one special character');
    }
    return true;
};

export const registerUserValidationRules = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail()
        .custom(isEmailUnique),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(isStrongPassword),
    body('fullname.firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s-']+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
    body('fullname.lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s-']+$/)
        .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
    body('role')
        .optional()
        .isIn(['user', 'artist'])
        .withMessage('Invalid role. Must be either "user" or "artist"'),
    validate
];

export const loginUserValidationRules = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    validate
];

// Validation for Google OAuth data
export const validateGoogleProfile = (profile) => {
    if (!profile) {
        throw new Error('No profile data received from Google');
    }
    if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
        throw new Error('No email received from Google');
    }
    if (!profile.name || !profile.name.givenName || !profile.name.familyName) {
        throw new Error('Incomplete name information from Google');
    }
    return true;
};