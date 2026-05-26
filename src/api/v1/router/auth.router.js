import router from 'express'
import * as authController from '../controller/auth.controller.js'

const authRouter = router.Router()

authRouter.post('/signup', authController.signupController)
authRouter.post('/confirm', authController.confirmSignupController)

export default authRouter