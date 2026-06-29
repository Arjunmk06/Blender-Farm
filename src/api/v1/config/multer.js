import multer from "multer";
import { AppError } from "../utilits/app.error.js";
import path from 'path'

function  fileFilter(req,file,cb) {
    const allowedext = ".blend"
    const filePath = path.extname(file.originalname); 

    if(filePath != allowedext){
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
        fileSize: 2* 1024* 1024 * 1024, // 10 MB
    }
})

