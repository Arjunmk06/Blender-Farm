import router from 'express'
import * as fileController from "../controller/file.controller.js"
import { authMiddleware } from '../middleware/auth.middleware.js'
import { upload } from '../config/multer.js'

const fileRouter = router.Router()

fileRouter.post('/projects/:projectId/files', authMiddleware, upload.single('file') ,fileController.fileUploadController)
fileRouter.get('/projects/:projectId/files', authMiddleware, fileController.filesInAProject)
fileRouter.get('/projects/:projectId/files/:fileId/download', authMiddleware, fileController.fileDownloadulr)
fileRouter.delete('/projects/:projectId/files/:fileId', authMiddleware, fileController.deleteSingleFile)
fileRouter.patch('/projects/:projectId/files/:fileId', authMiddleware, upload.single('file'), fileController.updateASingelFile)



export default fileRouter