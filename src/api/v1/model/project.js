import * as dynamodb from '../config/dynamodb.js'
import { QueryCommand , PutCommand} from '@aws-sdk/lib-dynamodb'
import { AppError } from '../utilits/app.error.js'



export async function createProject(data){
    try{
        await dynamodb.docuClient.send(
        new PutCommand({
            TableName: process.env.DYNAMO_DB_TABLE,
            Item:{
                pk: `USER#${data.sub}`,
                sk: `PROJECT#${data.projectId}`,
                entityType: 'PROJECT',
                projectId: data.projectId,
                ownerId: data.sub,
                title: data.title,
                description: data.description,
                status: 'ACTIVE',
                createAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

        })
    )

    }catch(err){
        console.log("error in create project db", err)

        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }
   
}