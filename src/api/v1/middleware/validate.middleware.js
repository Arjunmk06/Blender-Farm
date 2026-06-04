import { AppError } from "../utilits/app.error.js"
import { validationResult } from "express-validator"

export function validate(req, res,next) {


    const errors = validationResult(req)
   
  
    if(!errors.isEmpty()){
        throw new AppError(
            JSON.stringify(errors.array().map(err => ({ field: err.path, message: err.msg }))),
            400
        )

    }

    next()
}