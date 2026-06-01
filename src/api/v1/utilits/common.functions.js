import crypto from 'crypto' 


export function generateHash(value){

    return crypto
           .createHmac('sha256', process.env.COGNITO_CLIENT_SECRET)
           .update(value)
           .digest('base64'); 
}