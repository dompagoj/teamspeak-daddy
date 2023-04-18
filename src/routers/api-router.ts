import { Router } from 'express'
import { MessageRouter } from './message-router'
import { TeamspeakRouter } from './teamspeak-router'

export const ApiRouter = Router()

ApiRouter.use('/message', MessageRouter)
ApiRouter.use('/teamspeak', TeamspeakRouter)
