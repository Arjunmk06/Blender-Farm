import crypto from 'crypto'
import { SignUpCommand ,ConfirmSignUpCommand} from '@aws-sdk/client-cognito-identity-provider';
import {client} from '../config/cognito.js'


export function generateHashSecret(username){
    console.log("data", username)

    return crypto
           .createHmac('sha256', process.env.COGNITO_CLIENT_SECRET)
           .update(username + process.env.COGNITO_CLIENT_ID)
           .digest('base64'); 
}



export  async function signup(email, password){
    try{
        const command = new SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            Password: password,

            SecretHash: generateHashSecret(email),

            UserAttributes:[
                {
                    Name: 'email',
                    Value: email
                }
            ]
        })

        const response = await client.send(command)

        return {
            error: false,
            data: response
        }

    }catch(err){
        console.log(err)
        return {
            error: true,
            data: err
        }
    }
}

export async function confirmSignup(email, code){
    try{
        const command = new ConfirmSignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            SecretHash: generateHashSecret(email)
        })

        await client.send(command)

        return {
            error: false,
            data: "user verified"
        }

    }catch(err){
        console.log("err from confirm singup service", err)
        return {
            error: true,
            data: err
        }
    }
}