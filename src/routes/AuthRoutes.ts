import { Router } from "express";
import  AuthController  from "../controllers/AuthController";
import { validate } from "../middlewares/validationMiddleware";
import ValidationSchemas from "./ValidationSchemas";


const authRouter = Router()
const authController = new AuthController()

authRouter.post('/signup', validate(ValidationSchemas.signupSchema), authController.signup)
authRouter.post('/login', validate(ValidationSchemas.loginSchema),authController.login)

export default authRouter;