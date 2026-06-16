import { PutObjectCommand ,GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3.config.js";
import { AppError, errWrapper } from "../utilits/app.error.js";
import crypto from 'crypto'
import * as dynamodb from '../config/dynamodb.js'
import { QueryCommand , PutCommand} from '@aws-sdk/lib-dynamodb'

export async function fileUpload(file, extraInfo){
    try{
        
        let uniqueFileName = ""
        if(extraInfo?.key){
            uniqueFileName = `${extraInfo.key.split("#")[0]}#${file.originalname}`
        }else{
            uniqueFileName = `${crypto.randomUUID()}#${file.originalname}`
            
        }
        const  key= `${extraInfo.userId}/${extraInfo.projectId}/${uniqueFileName}`
        console.log("test", key)

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype 
        })

        await s3Client.send(command)

        return {
            fileName: uniqueFileName,
            Bucket:process.env.S3_BUCKET_NAME,
            size: file.size,
            mimeType: file.mimetype,
            s3Key: key
        }
    }catch(err){
        errWrapper(err)
    }
}


export async function createFile(data){
    try{


        const fileName = data.file.fileName.split("#")[1]
        const fileId = data.file.fileName.split("#")[0]
        const projectId = data.projectId
        const userId = data.userId

        await dynamodb.docuClient.send(
            new PutCommand({
                TableName: process.env.DYNAMO_DB_TABLE,
                Item:{
                    pk: `PROJECT#${projectId}`,
                    sk: `FILE#${fileId}`,
                    entityType: "FILE",
                    projectId: projectId,
                    ownerId: userId,
                    fileName: fileName,
                    fileSize: data.file.size,
                    mimeType: data.file.mimeType,
                    s3Key: data.file.s3Key,
                    uploadedAt: new Date().toISOString(),
                    fileId: fileId
                }
            })
        )
    }catch(err){
        errWrapper(err)
    }
}

export async function generateSignedUrl(s3Key){
    try{
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
        })

        return getSignedUrl(
            s3Client,
            command,
            {
                expiresIn: 3600
            }
        )
    }catch(err){
        errWrapper(err)
    }
}

export async function deleteFileFromS3(s3Key) {
    try{
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key
        }
        )

        await s3Client.send(command)

    }catch(err){
        errWrapper(err)
    }
}