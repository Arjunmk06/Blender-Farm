export class AppError extends Error{
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? "fail": "error"
    }
}

export function errWrapper(err){
    if(err instanceof AppError){
        throw err
    }else{
        throw new AppError(
            err.message || "Internal Server Error",
            500
        )
    }
}