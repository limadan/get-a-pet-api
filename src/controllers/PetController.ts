import { Request, Response } from "express";
import { Adoption } from "../converters/Adoption";
import { Pet } from "../converters/Pet";
import { AdoptionRepository } from "../repositories/AdoptionRepository";
import { PetRepository } from "../repositories/PetRepository";

export class PetController {
    public async registerNewPet(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const newPet = {
            user_id: req.userId,
            age: req.body.age,
            name: req.body.name,
            color: req.body.color,
            pet_image: req.imageUrl,
            weight: req.body.weight,
            adopted: false
        } as Pet

        await petRepository.create(newPet)
        return res.status(200).json({message: "Pet registrado com sucesso!"})
    }

    public async updatePet(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const pet = await petRepository.readOne(req.params.id)

        if(!pet){
            return res.status(404).json({message: "Pet inexistente!"})
        }

        if(pet.user_id !== req.userId){
            return res.status(403).json({message: "Não é possível alterar o pet de outro usuário"})
        }
        console.log(req.imageUrl)
        const petData = {
            id: req.params.id,
            name: req.body.name,
            color: req.body.color,
            age: req.body.age,
            pet_image: req.imageUrl? req.imageUrl : req.body.pet_image,
            weight: req.body.weight
        }

        console.log(petData)

        const result = await petRepository.updateOne(petData)
        if(!result){
            res.status(400).json({message: `Pet inexistente.`})
        }
        return res.status(200).json({message: "Pet atualizado com sucesso!"})
    }

    public async getAllPets(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const pets = await petRepository.readAll()
        if(!pets){
            return res.status(400).json({message: `Pet inexistente.`})
        }
        return res.status(200).json(pets)
    }

    public async getPetsByUser(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const pets = await petRepository.readByUserId(req.userId)
        if(!pets){
            return res.status(400).json({message: `Pet inexistente.`})
        }
        return res.status(200).json(pets)
    }

    public async getPetById(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const pet = await petRepository.readOne(req.params.id)
        if(!pet){
            return res.status(400).json({message: `Pet inexistente.`})
        }
        return res.status(200).json(pet)
    }

    public async deletePet(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const pet = await petRepository.readOne(req.params.id)
        if(!pet){
            return res.status(404).json({message: "Pet inexistente!"})
        }

        if(pet.user_id !== req.userId){
            return res.status(403).json({message: "Não é possível deletar o pet de outro usuário"})
        }
        
        await petRepository.deleteOne(req.params.id)

        return res.status(204).send()
    }

    public async scheduleAdoption(req: Request, res: Response): Promise<Response>{
        const petRepository = new PetRepository()
        const adoptionRepository = new AdoptionRepository()
        const pet = await petRepository.readOne(req.body.pet_id)
        
        if(!pet){
            return res.status(404).json({message: "Este pet não está registrado na plataforma"})
        }

        const petsFromUser = (await petRepository.readByUserId(req.userId)).map(pet=> pet.id)

        if(petsFromUser.includes(pet.id)){
            return res.status(403).json({message: "Não é possível adotar um pet registrado por você mesmo."})
        }
        const checkIfPetHasAdoption = await adoptionRepository.readByPetId(req.body.pet_id)

        if(checkIfPetHasAdoption){
            return res.status(403).json({message: "Este pet está em processo de adoção por outro usuário."})
        }
        const newAdoption = {
            user_id: req.userId,
            pet_id: req.body.pet_id,
            is_concluded: false
        }

        const result = await adoptionRepository.create(newAdoption)

        if(!result){
            return res.status(500).json({message: "Ocorreu algum erro ao fazer a adoção."})
        }
        return res.status(204).send(result)
    }

    public async getAdoptionsByUser(req: Request, res: Response): Promise<Response>{
        const adoptionRepository = new AdoptionRepository()

        const adoptions = await adoptionRepository.readByUserId(req.userId)

        return res.status(200).json(adoptions)
    }

    public async concludeAdoption(req: Request, res: Response): Promise<Response>{
        const adoptionRepository = new AdoptionRepository()
        const petRepository = new PetRepository()
        const adoptionId = req.body.adoption_id

        const adoption = await adoptionRepository.readOne(adoptionId)

        if(!adoption){
            return res.status(404).json({message: "Adoção inexistente ou não agendada."})
        }

        if(adoption.user_id!==req.userId){
            return res.status(403).json({message: "Não é possível concluir a adoção de outro usuário."})
        }
        const updateAdoption = {
            id: adoptionId,
            user_id: req.userId,
            pet_id: adoption.pet_id,
            is_concluded: true
        } as Adoption

        const result = await adoptionRepository.updateOne(updateAdoption)
        await petRepository.updatePetStatus(updateAdoption.pet_id)
        return res.status(200).json(result)

    }
}
