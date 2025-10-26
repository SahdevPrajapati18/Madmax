import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function authUserMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if(!token){
        return res.status(401).json({message: 'Unauthorized - No token provided'});
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.error('JWT verification error:', err.message);
        return res.status(401).json({
            message: 'Unauthorized - Invalid token',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}
