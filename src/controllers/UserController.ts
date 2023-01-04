import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {

    public async updateUser(req: Request, res: Response): Promise<Response>{
        const userRepository = new UserRepository()
        const user = await userRepository.readOne(req.userId)

        if(!user){
            return res.status(404).json({message: `Usuário inexistente.`})
        }


        const userData = {
            id: req.userId,
            email: req.body.email,
            name: req.body.name,
            profile_image: req.imageUrl
        }

        const checkIfEmailExists = await userRepository.readByEmail(userData.email)

        if(checkIfEmailExists&&userData.email!==user.email){
            return res.status(404).json({message: `E-mail já cadastrado. Informe outro e-mail.`})
        }
        await userRepository.updateOne(userData)
        
        return res.status(200).json({message: "Usuário atualizado com sucesso!"})
    }

    public async getUserById(req: Request, res: Response): Promise<Response>{
        const userRepository = new UserRepository()
        const user = await userRepository.readOne(req.userId)
        if(!user){
            return res.status(400).json({message: `Usuário inexistente.`})
        }
        return res.status(200).json(user)
    }

    public async deleteUser(req: Request, res: Response): Promise<Response>{
        const userRepository = new UserRepository()
        const user = await userRepository.readOne(req.userId)
        
        if(!user){
            return res.status(400).json({message: `Usuário inexistente.`})
        }
        const password = req.body.password

        if(!(await compare(password, user.password))){
            return res.status(403).json({message: `Senha incorreta. Operação não concluída`})
        }
        await userRepository.deleteOne(req.userId)

        return res.status(204).send()
    }
}
