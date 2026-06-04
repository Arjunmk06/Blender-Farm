import { CognitoJwtVerifier } from 'aws-jwt-verify'

export function getVerifier(type) {
    return CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: type,
        clientId: process.env.COGNITO_CLIENT_ID
    });
}