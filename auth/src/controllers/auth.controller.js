import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';

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

export default userModel;