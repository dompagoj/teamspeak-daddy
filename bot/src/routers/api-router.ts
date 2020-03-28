import { Router } from 'express'
import { MessageRouter } from './message-router'
import { AuthRouter } from './auth-router'
import { TeamspeakRouter } from './teamspeak-router'

export const ApiRouter = Router()

ApiRouter.use('/message', MessageRouter)
ApiRouter.use('/teamspeak', TeamspeakRouter)

ApiRouter.use('/auth', AuthRouter)
