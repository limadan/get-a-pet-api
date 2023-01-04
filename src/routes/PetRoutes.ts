import { Router } from "express";
import { PetController } from "../controllers/PetController";
import authMiddleware from "../middlewares/authMiddleware";
import uploadMiddleware from "../middlewares/uploadMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import ValidationSchemas from "./ValidationSchemas";

const petRouter = Router()
const petController = new PetController()

petRouter.post('/registerNewPet', authMiddleware, validate(ValidationSchemas.petSchema), uploadMiddleware('pet_image'), petController.registerNewPet)
petRouter.post('/scheduleAdoption', authMiddleware, petController.scheduleAdoption)
petRouter.put('/concludeAdoption', authMiddleware, petController.concludeAdoption)
petRouter.get('/getAllPets', petController.getAllPets)
petRouter.get('/getPetsByUser', authMiddleware, petController.getPetsByUser)
petRouter.get('/getAdoptionsByUser', authMiddleware, petController.getAdoptionsByUser)
petRouter.get('/getPetById/:id', petController.getPetById)
petRouter.put('/updatePet/:id',  authMiddleware, validate(ValidationSchemas.petSchema), petController.updatePet)
petRouter.delete('/deletePet/:id',  authMiddleware, petController.deletePet)

export default petRouter;