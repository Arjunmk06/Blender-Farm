import crypto from 'crypto'
import { SignUpCommand ,ConfirmSignUpCommand, InitiateAuthCommand} from '@aws-sdk/client-cognito-identity-provider';
import {client} from '../config/cognito.js'
import { decodeToken } from '../middleware/auth.middleware.js';
import { findDataByParams, createNewUser } from '../model/dynamodb.js';
import { generateHash } from '../utilits/common.functions.js';
import { AppError } from '../utilits/app.error.js';


export  async function signup(email, password){
    try{
        const command = new SignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            Password: password,
            SecretHash: generateHash(email + process.env.COGNITO_CLIENT_ID),

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
        console.log("error in singup service", err)

        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
        
    }
}

export async function confirmSignup(email, code){
    try{
        const command = new ConfirmSignUpCommand({
            ClientId: process.env.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            SecretHash: generateHash(email + process.env.COGNITO_CLIENT_ID)
        })

        await client.send(command)

        return {
            error: false,
            data: "user verified"
        }

    }catch(err){
        console.log("error in confirmSignup service", err)

        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }
}

export async function loginService(email, password) {
    try{
        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters:{
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: generateHash(email + process.env.COGNITO_CLIENT_ID)
            }
        })


        const response = await client.send(command)

        const jwtDeceoded = await decodeToken(response.AuthenticationResult.IdToken)

        const params= {
            TableName: process.env.DYNAMO_DB_TABLE,
            KeyConditionExpression: "pk = :pk AND sk = :sk",
            ExpressionAttributeValues :{
                ":pk": `USER#${jwtDeceoded.sub}`,
                ":sk": "PROFILE"
            }
        }
        const isUserPresent = await findDataByParams(params)


        if(!isUserPresent || Object.keys(isUserPresent).length === 0){
            await createNewUser(jwtDeceoded, response.AuthenticationResult)
        }

        return {
            error: false,
            data: response.AuthenticationResult
        }

    }catch(err){
        console.log("error in login service", err)

        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }
    
}

export async function reLoginService(refreshToken, email) {
    try{

         const params= {
            TableName: process.env.DYNAMO_DB_TABLE,
            KeyConditionExpression: "email = :email AND sk = :sk",
            IndexName: "email_index",
            ExpressionAttributeValues :{
                ":email": email,
                ":sk": "PROFILE"
            }
        }

        const isUserPresent = await findDataByParams(params)

        
        
        if(!isUserPresent || Object.keys(isUserPresent).length === 0){
            const errMessage = "invalid email, user is not present. Please signup"
            const errStatus = 404
            throw new AppError(errMessage, errStatus)
        }

        const hashedRefreshToken = generateHash(refreshToken)

        if(hashedRefreshToken != isUserPresent[0].refreshTokenHashed){
            const errMessage = "invalid refresh token. Please login "
            const errStatus = 401
            throw new AppError(errMessage, errStatus)
        } 

        const userId = isUserPresent[0].pk.split("#")[1]
        const command = new InitiateAuthCommand({
            AuthFlow: "REFRESH_TOKEN_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters:{
                USERNAME: email,
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: generateHashSecret(userId),
                
            }
        })


        const response  = await client.send(command)

        console.log("response", response)

        return {
            error:false,
            data: {
                accesToken: response.AuthenticationResult.AccessToken,
                IdToken: response.AuthenticationResult.IdToken
            }
        }

    }catch(err){

        console.log("error in relogin service", err)

        if (err instanceof AppError) {
            throw err;
        }

        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }
}