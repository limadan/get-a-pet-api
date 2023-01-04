import bucket from "../../firebase/storage";
import fs from 'fs'
import { Request, Response, NextFunction } from "express";

export default function uploadMiddleware(fieldname: string){
    return async (req: Request, res: Response, next: NextFunction)=>{
        
        if(!req.files){
            return next()
        }
        const fileObject = JSON.parse(JSON.stringify(req.files))
        const filePath = fileObject[fieldname].tempFilePath
        const file = fs.readFileSync(filePath)

        const cloudFileName = (Date.now()).toString()

        bucket.file(`${cloudFileName}`).save(file, {
                gzip: true,
                metadata: {
                    contentType: fileObject[fieldname].mimetype
                }
            })
            
        const url = (await bucket.file(`${cloudFileName}`).getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }))[0]

        req.imageUrl = url

        fs.unlinkSync(filePath)


        return next()
    }
}