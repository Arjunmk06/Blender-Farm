import * as authService from '../service/auth.service.js'


export async function signupController(req, res) {
    try{
        const {email, password} = req.body

        const response = await authService.signup(email, password)

        return res.json( {
            error: false,
            data: response.data
        })

    }catch(err){
        console.log("error from authon controller sigup", err)
        return res.json( {
            error: true,
            data: err
        })
    }
}

export async function confirmSignupController(req, res) {
    try{
        const {email, code} = req.body

        const response = await authService.confirmSignup(email, code)

        return res.json({
            error: false,
            data: response.data
        })

    }catch(err){
        console.log("error from confrim signup controllerr", err)
        return res.json(
            {
                error: true,
                data:err
            }
        )
    }
    
}

export async function loginController(req, res){
    try{
        const {email, password} = req.body

        const response = await authService.loginService(email, password)

        return res.json({
            error: false,
            data: response.data
        })
    }catch(err){
        console.log('error from login controller', err)
        return res.json({
            error: true,
            data: err
        })
    }
}

export async function reLoginController(req, res) {
    try{
        const {refreshToken, email} = req.body

        const reponse = await authService.reLoginService(refreshToken, email)

        return res.json({
            error:false,
            data: reponse.data
        })

    }catch(err){
        console.log("err from refresh toke controller", err)
        return res.json({
            error: true,
            data: err
        })
    }
    
}