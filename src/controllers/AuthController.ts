import { sign } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import {hash, compare} from 'bcryptjs'

export default class AuthController {
    public async signup(req: Request, res: Response): Promise<Response>{
        const userRepository = new UserRepository()
        const user = await userRepository.readByEmail(req.body.email)

        if(user){
            return res.status(403).json({message: "Usuário já existente"})
        }

        const newUser = {
            email: req.body.email,
            name: req.body.name,
            password: await hash(req.body.password, 10),
            profile_image: ""
        }

        await userRepository.create(newUser)
        return res.status(200).json({message: "Usuário criado com sucesso!"})
    }


    public async login(req: Request, res: Response): Promise<Response>{
        const userRepository = new UserRepository()
        const {email, password} = req.body

        const user = await userRepository.readByEmail(email)
        
        if(!user){
            return res.status(404).json({message: "Usuário inexistente"})
        }

        if(!(await compare(password, user.password))){
            return res.status(400).json({message: "Usuário e/ou senha incorreta"})
        }

        const token = sign({
            userId: user.id
        }, 'chave-secreta', {expiresIn: '1h'})

        return res.status(200).json({token: token})
    }
}
