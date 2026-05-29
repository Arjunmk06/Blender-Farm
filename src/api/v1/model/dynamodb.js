import * as dynamodb from '../config/dynamodb.js'
import { GetCommand , PutCommand} from '@aws-sdk/lib-dynamodb'
import { generateHash } from '../utilits/common.functions.js'


export async function isUserPresnet(key){
    try{


        const response = await dynamodb.docuClient.send(
            new GetCommand({
                TableName: process.env.DYNAMO_DB_TABLE,
                Key: {pk: `USER#${key}`, sk: "PROFILE"}
            })
        )

        console.log("response",response)

        if(response.Item === undefined){
            return true
        }else{
            return false
        }

    }catch(err){
        console.log("error from model dynamodb", err)
        return{
            error: true,
            data: err
        }
    }

}

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
                    refreshTokenHashed: refreshHased
                }
            })
        )

    }catch(err){
        console.log("err from crateuser model", err)
        return {
            error: true,
            data:err
        }
    }
}