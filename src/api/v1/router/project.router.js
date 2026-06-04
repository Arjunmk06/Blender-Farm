import router from 'express'
import * as projectController from '../controller/project.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {validateUpdateProject} from "../middleware/validate.middleware.js"

const projectRouter = router.Router()

projectRouter.post('/projects', authMiddleware, projectController.createProjectController)
projectRouter.get('/projects', authMiddleware, projectController.getAllProjectController)
projectRouter.get('/projects/:projectId', authMiddleware, projectController.getProjectController)
projectRouter.patch('/projects/:projectId', authMiddleware, projectController.updateProjectController )

export default projectRouter


