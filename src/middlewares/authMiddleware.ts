import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Token {
    userId: string
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction){
    const header = req.headers.authorization

    if(!header){
        return res.status(401).json({message: "Token não informado!"})
    }

    const token = (header.split(" "))[1]

    try{
        const decoded = verify(token, 'chave-secreta') as Token
        const userId = decoded.userId
        
        req.userId = userId
        return next()
    }catch{
        return res.status(401).json({message: "Usuário não autenticado"})
    }
}
