import crypto from 'crypto'




export async function createProject(title, description){
    try{
        

    }catch(err){
        console.log("error in create project service", err)

        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError(
            err.message || "Internal Server Error",
            500
        );
    }

}