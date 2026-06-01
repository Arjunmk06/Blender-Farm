import router from 'express'
import * as projectController from '../controller/project.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const projectRouter = router.Router()

projectRouter.post('/project', authMiddleware, projectController.createProjectController)
projectRouter.get('/projects', authMiddleware, projectController.getAllProjectController)


export default projectRouter


