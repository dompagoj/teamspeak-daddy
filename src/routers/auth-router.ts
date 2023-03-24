import { Router } from 'express'
import { login, register } from '../controllers/auth-controller'

export const AuthRouter = Router()

AuthRouter.post('/login', login)
AuthRouter.post('/register', register)
