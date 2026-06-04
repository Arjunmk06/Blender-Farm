import router from 'express'
import * as authController from '../controller/auth.controller.js'
import * as requestBody from '../utilits/rules.js'
import { validate } from '../middleware/validate.middleware.js'

const authRouter = router.Router()

authRouter.post('/signup', requestBody.UserCreatandLoginRules, validate, authController.signupController)
authRouter.post('/confirm', authController.confirmSignupController)
authRouter.post('/login', requestBody.UserCreatandLoginRules, validate, authController.loginController )
authRouter.post("/refresh", requestBody.refreshTokenRules, validate,  authController.reLoginController)

export default authRouter