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

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            artistId: user.artistId || null,
            fullname: user.fullname
        };

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

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            artistId: user.artistId || null,
            fullname: user.fullname
        };

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
            console.error('❌ Invalid Google user data:', { 
                hasUser: !!user, 
                hasEmails: !!user?.emails, 
                hasDisplayName: !!user?.displayName 
            });
            return res.redirect(`${config.FRONTEND_URL}?error=invalid_user_data`);
        }

        const email = user.emails[0].value;
        console.log('🔍 Looking up user:', email);

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { email: email },
                { googleId: user.id }
            ]
        });

        if (isUserAlreadyExists) {
            console.log('✅ Existing user found:', email);
            
            // Update googleId if not set
            if (!isUserAlreadyExists.googleId) {
                isUserAlreadyExists.googleId = user.id;
                await isUserAlreadyExists.save();
            }

            const payload = {
                id: isUserAlreadyExists._id,
                email: isUserAlreadyExists.email,
                role: isUserAlreadyExists.role,
                artistId: isUserAlreadyExists.artistId || null,
                fullname: isUserAlreadyExists.fullname
            };

            const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

            if (isUserAlreadyExists.role === "artist") {
                return res.redirect(`${config.FRONTEND_URL}/artist/dashboard?token=${token}`);
            }

            return res.redirect(`${config.FRONTEND_URL}?token=${token}`);
        }

        console.log('✨ Creating new user:', email);

        // Parse name from Google profile
        const nameParts = user.displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser = await userModel.create({
            email: email,
            googleId: user.id,
            fullname: {
                firstName: firstName,
                lastName: lastName,
            },
            role: 'user'
        });

        await publishToQueue("user_created", {
            id: newUser._id,
            email: newUser.email,
            fullname: newUser.fullname,
            role: newUser.role
        });

        const payload = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            artistId: newUser.artistId || null,
            fullname: newUser.fullname
        };

        const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

        console.log('✅ New user created, redirecting with token');
        return res.redirect(`${config.FRONTEND_URL}?token=${token}`);
    } catch (err) {
        console.error('❌ Google auth callback error:', err);
        return res.redirect(`${config.FRONTEND_URL}?error=auth_failed&message=${encodeURIComponent(err.message)}`);
    }
}

export async function getCurrentUser(req, res) {
    try {
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
        res.json({
            message: 'Logout successful'
        });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}