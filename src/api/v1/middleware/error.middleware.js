export function errorMiddleware(err, req, res, next) {

    const statusCode = err.statusCode || 500

    return res.status(statusCode).json({
        error: true,
        message: err.message || "Internal Server Error"
    })
    
}