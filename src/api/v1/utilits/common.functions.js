import crypto from 'crypto' 
import { errWrapper } from './app.error.js';
import { getItemByPkSk } from '../model/common.db.js';


export function generateHash(value){

    return crypto
           .createHmac('sha256', process.env.COGNITO_CLIENT_SECRET)
           .update(value + process.env.COGNITO_CLIENT_ID)
           .digest("base64"); 
}

export async function validateData(userId, projectId, fileId = undefined) {
    try{
        let projectDetails = {}
        let fileDetails = {}
        const userKey = `USER#${userId}`
        const projectKey =`PROJECT#${projectId}`

    
        projectDetails = await getItemByPkSk(userKey, projectKey)

        if(projectDetails === undefined){
            throw new AppError(
                'Project not found',
                404
            )
        }

        

        if(fileId !== undefined){
            const fileKey = `FILE#${fileId}`
            fileDetails = await getItemByPkSk(projectKey, fileKey)
            if(fileDetails === undefined){
                throw new AppError(
                    'File not found',
                    404
                )
            }
        }

        return {
            projectDetails: projectDetails,
            fileDetails: fileDetails
        }
    }catch(err){
        errWrapper(err)
    }
}