import { AppError } from "../utilits/app.error.js"

export function validateUpdateProject(req,res,next){

    const data = req.body

    const statusValues = ['ACTIVE','PAUSED', 'DROPPED', 'ARCHIVED']


    if(data === {}){
        throw new AppError(
            'No fields to update',
            400
        )
    }

    if(data?.title && data.title.trim() ===""){
         throw new AppError(
            'Title is required',
            400
        )
    }

    if(data?.status && !statusValues.includes(data.status)){
         throw new AppError(
            'invalid status value',
            400
        )
    }

    if(data?.description && data.description.trim().length > 100 ){
        throw new AppError(
            'Description have maximum value of 100 length',
            400
        )
    }
}