import * as projectService from '../service/project.service.js'


export async function createProjectController(req,res,next){
    try{
        const {title, description} = req.body
        const userDetails = req.user

         const response = await projectService.createProjectService(title, description, userDetails)

        return res.json({
            error: false,
            data: response.data
        })

    }catch(err){
        next(err)
    }
}

export async function getAllProjectController(req, res, next){
    try{
        const userDetais = req.user

        const resposnes = await projectService.getAllProject(userDetais)

        return res.json({
            error:false,
            data: resposnes.data
        })

    }catch(err){
        next(err)
    }
}

export async function getProjectController(req, res,next){
    try{

        const projectId = req.params.projectId
        const userDetails = req.user

        const response = await projectService.getProject(projectId, userDetails)

        return res.json({
            error: false,
            data: response.data
        })

    }catch(err){
        next(err)
    }
}


export async function updateProjectController(req, res, next){
    try{
        const data = req.body
        const projectId = req.params.projectId
        const userDetails = req.user

        const response = await projectService.updateProject(data, projectId, userDetails)

        return res.json({
            error: false,
            data: response.data
        })


    }catch(err){
        next(err)
    }

}