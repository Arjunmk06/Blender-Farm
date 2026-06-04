import * as dynamodb from '../config/dynamodb.js'
import { QueryCommand , PutCommand} from '@aws-sdk/lib-dynamodb'
import { generateHash } from '../utilits/common.functions.js'
import { AppError } from '../utilits/app.error.js'




export async function createNewUser(data, authenticateResult){
    try{

        const refreshHased = generateHash(authenticateResult.RefreshToken)

        await dynamodb.docuClient.send(
            new PutCommand({
                TableName: process.env.DYNAMO_DB_TABLE,
                Item:{
                    pk: `USER#${data.sub}`,
                    sk: 'PROFILE',
                    email: data.email,
                    plan: 'free',
                    storageUsed: 0,
                    createAt: new Date().toISOString(),
                    refreshTokenHashed: refreshHased,
                    entityType: "PROFILE"
                }
            })
        )

    }catch(err){
        console.log("err from crateuser model", err)
        const errorMessage = err.data?.message || "internal error"
        const errorStatus = err.data?.statusCode || 500
        throw new AppError( errorMessage, errorStatus )
    }
}



