import * as authService from '../service/auth.service.js'


export async function signupController(req, res) {
    try{
        const {email, password} = req.body

        const response = await authService.signup(email, password)

        return res.json( {
            error: false,
            data: response
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
            data: response
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
            data: response
        })
    }catch(err){
        console.log('error from login controller', err)
        return res.json({
            error: true,
            data: err
        })
    }
}