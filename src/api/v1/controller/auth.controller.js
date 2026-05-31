import * as authService from '../service/auth.service.js'


export async function signupController(req, res, next) {
    try{
        const {email, password} = req.body

        const response = await authService.signup(email, password)

        return res.json( {
            error: false,
            data: response.data
        })

    }catch(err){
        console.log("error from authon controller sigup", err)
        next(err)
    }
}

export async function confirmSignupController(req, res, next) {
    try{
        const {email, code} = req.body

        const response = await authService.confirmSignup(email, code)

        return res.json({
            error: false,
            data: response.data
        })

    }catch(err){
        console.log("error from confrim signup controllerr", err)
        next(err)
    }
    
}

export async function loginController(req, res, next){
    try{
        const {email, password} = req.body

        const response = await authService.loginService(email, password)

        console.log("check",response)

        return res.json({
            error: false,
            data: response.data
        })
    }catch(err){
        console.log('error from login controller', err)
        next(err)
    }
}

export async function reLoginController(req, res, next) {
    try{
        const {refreshToken, email} = req.body

        const reponse = await authService.reLoginService(refreshToken, email)

        return res.json({
            error:false,
            data: reponse.data
        })

    }catch(err){
        next(err)
    }
    
}