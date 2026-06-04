import {body} from 'express-validator'
import { AppError } from './app.error.js';

export const UpadteProjectRules = [
    body('title')
    .optional().trim().notEmpty().withMessage("Title can't be empty")
    .isLength({min: 3, max:20}).withMessage('Title must be length of character between 3 to 20' ),

    body('description')
    .optional().trim().notEmpty().withMessage("Descriptom can't be empty")
    .isLength({min:3}).withMessage('Description must be at least 3 characters'),

    body('status')
    .optional().isString().withMessage('Status should be string')
    .isIn(['ACTIVE','PAUSED', 'DROPPED', 'ARCHIVED']).withMessage('Invalid status provided'),

    body().custom((value, {req})=>{
        const keys = Object.keys(req.body);

        if(keys.length === 0){
            throw new AppError(
                'Atleast one field needed to update',
                400
            )
        }
        return true;
    })
]

export const UserCreatandLoginRules = [
    body('email')
    .isEmail().withMessage('invalid email, please provide an valide mail')
    .notEmpty().withMessage('email is required'),

    body('password')
    .isLength({min: 6}).withMessage('Password must be at least 6 characters long')
]

export const refreshTokenRules = [
    body('email')
    .isEmail().withMessage('invalid email, please provide an valide mail')
    .notEmpty().withMessage('email is required'),

    body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
    .trim()
]


