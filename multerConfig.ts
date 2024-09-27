import multer from "multer";
import path from 'path'
import { Request } from "express";
const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const fileFilter=(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
  if (file.mimetype==='image/jpeg'||file.mimetype==='image/png') {
    cb(null,true)
  }else{
    cb(new Error('File type not allowed'))
  }
}

export const upload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*5},
    fileFilter
})