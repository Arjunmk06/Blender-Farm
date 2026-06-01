import jwt from 'jsonwebtoken'

import { getVerifier } from '../utilits/authentication.function.js';
import { AppError } from '../utilits/app.error.js';



export async function decodeToken(token,type='access'){
    try{
        const verifier = getVerifier(type)
        const decoded = await verifier.verify(token)

        console.log("Test", decoded)

        return {
            sub: decoded.sub,
            email: decoded.email
        }
    }catch(err){
        console.log("error from auth middleware decode", err)
        throw new AppError("invalid or expired token", 401)
    }
}

export async function authMiddleware(req, res,next){
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        throw new AppError(
            'Access denied. No token provided.',
            401
        )
    }

    try {
  
        const decoded = await decodeToken(token)
        req.user = {
            sub: decoded.sub,
            email: decoded.sub
        };

        next();
    } catch (error) {
        next(
            new AppError(
                "Invalid or expired token",
                401
            )
        )
    }
}
