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
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '2d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}


export async function register(req, res) {
    try {
        const { email, password, fullname = {} } = req.body || {};
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
        });

        const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '2d' });

         
        await publishToQueue("user_created", {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                role: user.role
        });

        res.cookie('token', token);

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}

export async function googleAuthCallback(req, res) {
    try {
        const user = req.user;
        
        if (!user || !user.emails || !user.emails[0] || !user.name) {
            return res.status(400).json({ 
                message: 'Invalid Google account data' 
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { email: user.emails[0].value },
                { googleId: user.id }
            ]
        });

        if (isUserAlreadyExists) {
            const token = jwt.sign(
                { id: isUserAlreadyExists._id, role: isUserAlreadyExists.role }, 
                config.JWT_SECRET, 
                { expiresIn: '2d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
            });

            return res.status(200).json({
                message: 'User logged in successfully',
                user: {
                    id: isUserAlreadyExists._id,
                    email: isUserAlreadyExists.email,
                    fullname: isUserAlreadyExists.fullname,
                    role: isUserAlreadyExists.role,
                },
            });
        }

        const newUser = await userModel.create({
            email: user.emails[0].value,
            googleId: user.id,
            fullname: {
                firstName: user.name.givenName || '',
                lastName: user.name.familyName || '',
            },
        });

        await publishToQueue("user_created", {
            id: newUser._id,
            email: newUser.email,
            fullname: newUser.fullname,
            role: newUser.role
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            config.JWT_SECRET, 
            { expiresIn: '2d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('Google auth callback error:', err);
        return res.status(500).json({ 
            message: 'Error processing Google authentication',
            error: err.message 
        });
    }
}
