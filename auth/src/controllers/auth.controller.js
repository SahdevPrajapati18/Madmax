import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import { publishToQueue } from '../broker/rabbit.js';

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Payload for JWT
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            artistId: user.artistId || null,
            fullname: user.fullname
        };

        // Sign JWT
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: payload
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}


export async function register(req, res) {
    try {
        const { email, password, fullname = {}, role = "user" } = req.body || {};
        const { firstName, lastName } = fullname;

        const isUserAlreadyExists = await userModel.findOne({ email });

        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email,
            password: hash,
            fullname: {
                firstName,
                lastName,
            },
            role
        });

        // Payload for JWT
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            artistId: user.artistId || null,
            fullname: user.fullname
        };

        // Sign JWT
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

        await publishToQueue("user_created", {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            role: user.role
        });

        return res.status(201).json({
            message: 'User created successfully',
            token,
            user: payload
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function googleAuthCallback(req, res) {
    try {
        const user = req.user;

        if (!user || !user.emails || !user.emails[0] || !user.displayName) {
            return res.status(500).json({
                message: 'Error processing Google authentication',
                error: 'Invalid Google account data'
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { email: user.emails[0].value },
                { googleId: user.id }
            ]
        });

        if (isUserAlreadyExists) {
            // Payload for JWT
            const payload = {
                id: isUserAlreadyExists._id,
                email: isUserAlreadyExists.email,
                role: isUserAlreadyExists.role,
                artistId: isUserAlreadyExists.artistId || null,
                fullname: isUserAlreadyExists.fullname
            };

            // Sign JWT
            const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

            if (isUserAlreadyExists.role === "artist") {
                return res.redirect(`https://madmax-nine.vercel.app/artist/dashboard?token=${token}`);
            }

            return res.redirect(`https://madmax-nine.vercel.app?token=${token}`);
        }

        // Parse name from Google profile
        const nameParts = user.displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser = await userModel.create({
            email: user.emails[0].value,
            googleId: user.id,
            fullname: {
                firstName: firstName,
                lastName: lastName,
            },
            role: 'user' // Default role for new Google users
        });

        await publishToQueue("user_created", {
            id: newUser._id,
            email: newUser.email,
            fullname: newUser.fullname,
            role: newUser.role
        });

        // Payload for JWT
        const payload = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            artistId: newUser.artistId || null,
            fullname: newUser.fullname
        };

        // Sign JWT
        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

        return res.redirect(`https://madmax-nine.vercel.app?token=${token}`);
    } catch (err) {
        console.error('Google auth callback error:', err);
        return res.status(500).json({
            message: 'Error processing Google authentication',
            error: err.message
        });
    }
}

export async function getCurrentUser(req, res) {
    try {
        // The user should be available in req.user from the auth middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                fullname: req.user.fullname,
                role: req.user.role,
                artistId: req.user.artistId
            }
        });
    } catch (err) {
        console.error('Get current user error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function logout(req, res) {
    try {
        // Since we're using JWT tokens, logout is handled on the frontend
        // by removing the token from localStorage
        res.json({
            message: 'Logout successful'
        });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
