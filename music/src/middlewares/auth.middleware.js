import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function authArtistMiddleware(req, res, next){

    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        if(decoded.role !== 'artist'){
            return res.status(403).json({message: 'Forbidden'});
        }
        req.user = decoded;
        next();
    }catch(err){
        console.error(err);
        return res.status(401).json({message: 'Unauthorized'});
    }
}

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