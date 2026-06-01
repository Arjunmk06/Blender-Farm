import { CognitoJwtVerifier } from 'aws-jwt-verify'

export function getVerifier() {
    return CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        clientId: process.env.COGNITO_CLIENT_ID
    });
}