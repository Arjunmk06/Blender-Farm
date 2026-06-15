import * as fileService from "../service/file.service.js"

export async function fileUploadController(req, res, next){
    try{
        const data = {
            file: req?.file,
            projectId: req.params.projectId
        }

        const userDetails = req.user
        const response = await fileService.uploadFile(data, userDetails)

        return res.json({
            error: false,
            data: response.data
        })

    }catch(err){
        next(err)
    }
}

export async function filesInAProject(req,res,next) {
    try{
        const projectId = req.params.projectId
        const userDetails = req.user
        console.log(userDetails)

        const response = await fileService.getFileByProject(projectId, userDetails)

        return res.json({
            error:false,
            data: response.data
        })
    }catch(err){
        next(err)
    }
}

export async function fileDownloadulr(req, res, next) {
    try{
        console.log("reached here 3")
        const projectId = req.params.projectId
        const fileId = req.params.fileId
        const userDetails = req.user

        console.log("reached here 1")
        const response = await fileService.donwloadFile(fileId, projectId, userDetails)
        console.log("reached here 2")

        return res.json({
            error:false,
            data: response.data
        })
    }catch(err){
        next(err)
    }
    
}

export async function deleteSingleFile(req, res, next){
    try{
        const projectId = req.params.projectId
        const fileId = req.params.fileId
        const userDetails = req.user

        const response = await fileService.deleteFile(fileId, projectId, userDetails)

        return res.json({
            error: false,
            data: response.data
        })
    }catch(err){
        next(err)
    }
}

export async function updateASingelFile(req, res, next){
    try{
        const projectId = req.params.projectId
        const fileId = req.params.fileId
        const userDetails = req.user
        const file = req.file

        const response = await fileService.updateFile(fileId, projectId, userDetails, file)

        return res.json({
            error: false,
            data: response.data
        })
    }catch(err){
        next(err)
    }
}