import { Router } from 'express'
import { getTeamspeakChannels, getTeamspeakCurrentChannel, moveBotToChannel } from '../controllers/teamspeak-controller'

export const TeamspeakRouter = Router()

TeamspeakRouter.get('/channels', getTeamspeakChannels)
TeamspeakRouter.get('/current-channel', getTeamspeakCurrentChannel)
TeamspeakRouter.post('/move-bot/:channelId', moveBotToChannel)
