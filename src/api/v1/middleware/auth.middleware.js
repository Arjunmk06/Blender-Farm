import jwt from 'jsonwebtoken'

export async function decodeToken(token){
    try{

        const decoded = jwt.decode(token)

        return {
            sub: decoded.sub,
            email: decoded.email
        }

    }catch(err){
        console.log("error from auth middleware decode", err)
        return {
            error: true,
            data: err
        }
    }
}