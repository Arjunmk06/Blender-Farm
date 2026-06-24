import { AppError,errWrapper } from "../utilits/app.error.js";
import { fileUpload, createFile, generateSignedUrl, deleteFileFromS3 } from "../model/file.js";
import { getItemByPkSk, findDataByParams, deleteItemByPkSk, createUpdateKeys, updateByParams,  } from "../model/common.db.js";
import { validateData } from "../utilits/common.functions.js";

export async function uploadFile(data, userDetails){
    try{

        if(data.file === undefined){
            throw new AppError(
                'file is missing',
                400
            )
        }

        await validateData(userDetails.sub, data.projectId)

        const extraInfo = {
            userId: userDetails.sub,
            projectId: data.projectId
        }


        const uploadFile = await fileUpload(data.file,extraInfo)

        const fileData = {
            file: uploadFile,
            projectId: data.projectId,
            userId: userDetails.sub,
        }

        await createFile(fileData)

        return{
            error:false,
            data: {
                message: 'file Uploaded successfully',
                data:{
                    fileName: uploadFile.fileName.split("#")[1],
                    fileId: uploadFile.fileName.split("#")[0],
                    filesize: uploadFile.size,
                    mimeType: uploadFile.mimeType
                }
            }
        }
    }catch(err){
        console.log("error from file upload",err)
        errWrapper(err)
    }
}

export async function getFileByProject(projectId, userDetails){
    try{
        
        await validateData(userDetails.sub, projectId)

        const params = {
            TableName: process.env.DYNAMO_DB_TABLE,
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
            ExpressionAttributeValues :{
                ":pk": `PROJECT#${projectId}`,
                ":sk": "FILE"
            }

        }

        const result = await findDataByParams(params)

        const files = []

        console.log("files", result)

        for(let item of result){
            files.push({
                id: item.fileId,
                fileName: item.fileName,
                mimeType: item.mimeType,
                fileSize: item.fileSize,
                uploadedAt: item.uploadedAt
            })
        }

        return {
            error: false,
            data: files
        }

    }catch(err){
        console.log("error from get file by project", err)
        errWrapper(err)
    }
}

export async function downloadFile(fileId, projectId, userDetails) {
    try{
        const {projectDetails, fileDetails} = await validateData(userDetails.sub, projectId, fileId)

        const downloadable = await generateSignedUrl(fileDetails.s3Key)


        return{
            error: false,
            data:  {
                fileId: fileDetails.fileId,
                fileName: fileDetails.fileName,
                downloadable,
                expiresIn: 3600,
            }
        }
    }catch(err){
        console.log("error from download file", err)
        errWrapper(err)
    }
}


export async function deleteFile(fileId, projectId, userDetails) {
    try{
        const {projectDetails, fileDetails} =  await validateData(userDetails.sub, projectId, fileId)

        await deleteFileFromS3(fileDetails.s3Key)

        const pk = `PROJECT#${projectId}`
        const sk =  `FILE#${fileId}`

        await  deleteItemByPkSk(pk, sk)

        return{
            error: false,
            data: "sucessfully deleted the file"
        }
    }catch(err){
        console.log("error from download file", err)
        errWrapper(err)
    }
}



export async function updateFile(fileId, projectId, userDetails, fileData) {
    try{

        if(fileData === undefined){
            throw new AppError(
                "File is missing",
                400
            )
        }

        const {projectDetails, fileDetails} =  await validateData(userDetails.sub, projectId, fileId)
        const extraInfo = {
            userId: userDetails.sub,
            projectId: projectId,
            key: fileDetails.s3Key.split("/").at(-1)
        }
        const uploadFile = await fileUpload(fileData, extraInfo)
        await deleteFileFromS3(fileDetails.s3Key)
      
        const updatedAt = new Date().toISOString()

        const updatingInfo = {
            uploadedAt: updatedAt,
            fileName: uploadFile.fileName.split("#")[1],
            fileSize: uploadFile.size,
            mimeType: uploadFile.mimeType,
            s3Key: uploadFile.s3Key
        }

        const updateData = createUpdateKeys(updatingInfo)
       


        const updateParams = {
            TableName: process.env.DYNAMO_DB_TABLE,
            Key:{
                pk: `PROJECT#${projectId}`,
                sk: `FILE#${fileId}`
            },
            UpdateExpression: updateData.UpdateExpression,
            ExpressionAttributeNames: updateData.ExpressionAttributeNames,
            ExpressionAttributeValues: updateData.ExpressionAttributeValues,
            ReturnValues: "UPDATED_NEW" 
        }
         console.log(updateParams)

            
        const response = await updateByParams(updateParams)


        return{
            error:false,
            data: {
                message: 'file Updated successfully',
                data:{
                    fileName: uploadFile.fileName.split("#")[1],
                    fileId: uploadFile.fileName.split("#")[0],
                    filesize: uploadFile.size,
                    mimeType: uploadFile.mimeType,
                    uploadedAt: response.uploadedAt
                }
            }
        }
    }catch(err){
        console.log("error from download file", err)
        errWrapper(err)
    }
}
