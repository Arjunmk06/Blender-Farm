import crypto from 'crypto'
import { createProject } from '../model/project.js';
import { findDataByParams, getItemByPkSk, createUpdateKeys, updateByParams, deleteItemByPkSk} from '../model/common.db.js';
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
        errWrapper(err)
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

        const projects = []

        for(let item of result){
            projects.push({
                id: item.projectId,
                title: item.title,
                description: item?.description || "",
                status: item.status,
                createdAt:item.createdAt,
                updatedAt: item.updatedAt
            })
        }

        return {
            error: false,
            data: projects
        }

    }catch(err){
        console.log("error from get all project ", err)
        errWrapper(err)
    }
}

export async function getProject(projectId, userDetails){
    try{

        const pk = `USER#${userDetails.sub}`
        const sk =`PROJECT#${projectId}`

        const item = await getItemByPkSk(pk, sk)

        if(item === undefined){
            throw new AppError(
                'Project not found',
                404
            )
        }

        const response = {
            id: item.projectId,
            title: item.title,
            description: item?.description || "",
            status: item.status,
            createdAt:item.createdAt,
            updatedAt: item.updatedAt
        }

        return {
            error: false,
            data: response
        }


    }catch(err){
        console.log("error from get project ", err)
        errWrapper(err
        )
    }
}

export async function updateProject(data,projectId,userDetails){
    try{

        const pk = `USER#${userDetails.sub}`
        const sk =`PROJECT#${projectId}`

        const item = await getItemByPkSk(pk, sk)

        if(item === undefined){
            throw new AppError(
                'Project not found',
                404
            )
        }

        if(Object.keys(data).length === 0){
            throw new AppError(
                'Alteast one field required to update',
                400
            )
        }

        const updateData = createUpdateKeys(data)

        //ading updatedAt case

        data.UpdateExpression+='#updatedAt = :updatedAt'
        data.ExpressionAttributeNames['#updatedAt'] = 'updatedAt'
        data.ExpressionAttributeValues[':updatedAt'] = new Date().toISOString()

        const updateParams = {
                TableName: process.env.DYNAMO_DB_TABLE,
                Key:{
                    pk: pk,
                    sk: sk
                },
                UpdateExpression: updateData.UpdateExpression,
                ExpressionAttributeNames: updateData.ExpressionAttributeNames,
                ExpressionAttributeValues: updateData.ExpressionAttributeValues,
                ReturnValues: "UPDATED_NEW" 
            }

            
            const response = await updateByParams(updateParams)

            return {
                error: false,
                data: response
            }

    }catch(err){
        console.log("err from update project", err)
        errWrapper(err)
    }
}

export async function deleteProject(projectId, userDetails){
    try{

        const pk = `USER#${userDetails.sub}`
        const sk =`PROJECT#${projectId}`

        const item = await getItemByPkSk(pk, sk)

        if(item === undefined){
            throw new AppError(
                'Project not found',
                404
            )
        }

        await deleteItemByPkSk(pk, sk)

        return {
            error:false,
            data:"Project deleted successfully"
            }

    }catch(err){
        console.log("err from delete project", err)
        errWrapper(err)
    }
}