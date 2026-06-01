import crypto from 'crypto'
import { createProject } from '../model/project.js';
import { findDataByParams } from '../model/common.db.js';
import { AppError, errWrapper } from '../utilits/app.error.js';



export async function createProjectService(title, description, userDetails){
    try{
        const projectId = crypto.randomUUID()

        const params= {
                TableName: process.env.DYNAMO_DB_TABLE,
                KeyConditionExpression: "pk = :pk AND sk = :sk",
                ExpressionAttributeValues :{
                    ":pk": `USER#${userDetails.sub}`,
                    ":sk": "PROFILE"
                }
            }
        const isUserPresent = await findDataByParams(params)
        
        
        if(!isUserPresent || Object.keys(isUserPresent).length === 0){
            throw new AppError(
                "user not found",
                404
            )
        }

        const data= {
            projectId: projectId,
            sub: userDetails.sub,
            title: title,
            description: description
        }
        
        await createProject(data)

        return {
            error:false,
            data: {
                message: 'New project created.',
                id: projectId
            }
        }
    }catch(err){
        console.log("error in create project service", err)

        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }

}

export async function getAllProject(userDetails){
    try{

        const params = {
            TableName: process.env.DYNAMO_DB_TABLE,
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
            ExpressionAttributeValues :{
                ":pk": `USER#${userDetails.sub}`,
                ":sk": "PROJECT"
            }

        }

        const result = await findDataByParams(params)

        return {
            error: false,
            data: result
        }

    }catch(err){
        console.log("error from get all project ", err)
        errWrapper(err)
    }
}