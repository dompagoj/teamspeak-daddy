import { Router } from 'express'
import { getTeamspeakChannels, getTeamspeakCurrentChannel } from '../controllers/teamspeak-controller'

export const TeamspeakRouter = Router()

TeamspeakRouter.get('/channels', getTeamspeakChannels)
TeamspeakRouter.get('/current-channel', getTeamspeakCurrentChannel)
