import { Router } from "express";
import { UserController } from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware";
import uploadMiddleware from "../middlewares/uploadMiddleware";
import ValidationSchemas from "./ValidationSchemas";
import { validate } from "../middlewares/validationMiddleware";

const userRouter = Router()
const userController = new UserController()

userRouter.get('/getUserData', authMiddleware, userController.getUserById)
userRouter.put('/updateUser',  authMiddleware,  validate(ValidationSchemas.updateSchema), uploadMiddleware('profile_image'), userController.updateUser)
userRouter.delete('/deleteUser', authMiddleware, userController.deleteUser)

export default userRouter;