import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function authUserMiddleware(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({message: 'Unauthorized'});
    }
}
