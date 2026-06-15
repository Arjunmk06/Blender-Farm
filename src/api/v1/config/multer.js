import multer from "multer";
import { AppError } from "../utilits/app.error.js";

function  fileFilter(req,file,cb) {
    const allowedMimeType = "application/pdf"

    if(file.mimetype != allowedMimeType){
        return cb(new AppError(
            "only support blender file",
            400
        ), false)
    }

    cb(null, true)
}


export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits:{
        fileSize: 10 * 1024 * 1024, // 10 MB
    }
})

