import router from 'express'
import * as projectController from '../controller/project.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {validate} from "../middleware/validate.middleware.js"
import * as requestBody  from '../utilits/rules.js'

const projectRouter = router.Router()

projectRouter.post('/projects', authMiddleware, projectController.createProjectController)
projectRouter.get('/projects', authMiddleware, projectController.getAllProjectController)
projectRouter.get('/projects/:projectId', authMiddleware, projectController.getProjectController)
projectRouter.patch('/projects/:projectId', authMiddleware, requestBody.UpadteProjectRules, validate, projectController.updateProjectController )
projectRouter.delete('/projects/:projectId', authMiddleware, projectController.deleteProjecController)

export default projectRouter


