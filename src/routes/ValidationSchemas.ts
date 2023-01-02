import { body } from 'express-validator'

const signupSchema = [
    body('name').isLength({min: 3}).withMessage('O nome deve possuir mais que 3 caracteres'),
    body('password').isLength({min: 6}).withMessage('Sua senha deve conter no mínimo 6 caracteres'),
    body('email').isEmail().withMessage("Informe um email válido para cadastro")
]

const loginSchema = [
    body('email').isEmail().withMessage("Informe um email válido para login")
]

const petSchema = [
    body('name').isLength({min: 3}).withMessage('O nome deve possuir mais que 3 caracteres'),
    body('email').isEmail().withMessage("Informe um email válido para cadastro")
]

export default {signupSchema, petSchema, loginSchema}