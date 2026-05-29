import router from 'express'
import * as authController from '../controller/auth.controller.js'

const authRouter = router.Router()

authRouter.post('/signup', authController.signupController)
authRouter.post('/confirm', authController.confirmSignupController)
authRouter.post('/login', authController.loginController )
authRouter.post("/refresh", authController.reLoginController)

export default authRouter