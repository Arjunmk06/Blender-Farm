import * as dynamodb from '../config/dynamodb.js'
import { QueryCommand , PutCommand, UpdateCommand, GetCommand} from '@aws-sdk/lib-dynamodb'
import { generateHash } from '../utilits/common.functions.js'
import { AppError, errWrapper } from '../utilits/app.error.js'




export async function findDataByParams(params){
    try{
        const response = await dynamodb.docuClient.send(
            new QueryCommand(params)
        )



        if(response.Items.length == 0){
            return {}
        }else{
            return response.Items
        }

    }catch(err){
        console.log("error from model dynamodb", err)
        const errorMessage = err.data?.message || "internal error"
        const errorStatus = err.data?.statusCode || 500
        throw new AppError( errorMessage, errorStatus )
    }

}


export async function updateByParams(params){
    try{

        const response = await dynamodb.docuClient.send(
            new UpdateCommand(params)
        )

        return response

    }catch(err){
        errWrapper(err)
    }
}

export async function getItemByPkSk(pk,sk){
    try{

        const command = {
            TableName: process.env.DYNAMO_DB_TABLE,
            Key:{
                pk: pk,
                sk: sk
            }

        }

        const response = await dynamodb.docuClient.send(
            new GetCommand(command)
        )

        return response.Item
    }catch(err){
        errWrapper(err)
    }
}

export function createUpdateKeys(params) {

    let UpdateExpression = "SET "
    let ExpressionAttributeNames = {}
    let ExpressionAttributeValues = {}


    for(let [key, value] of Object.entries(params)){
        UpdateExpression+= `#${key} = :${key}, `
        ExpressionAttributeNames[`#${key}`] = key
        ExpressionAttributeValues[`:${key}`] = value
    }

    UpdateExpression = UpdateExpression.slice(0,UpdateExpression.length-2)

    return {
        UpdateExpression: UpdateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues
    }
    
}