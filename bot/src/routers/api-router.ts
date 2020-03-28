import { Router } from 'express'
import { MessageRouter } from './message-router'
import { AuthRouter } from './auth-router'

export const ApiRouter = Router()

ApiRouter.use('/message', MessageRouter)

ApiRouter.use('/auth', AuthRouter)
