import { Request, Response } from 'express'
import { TeamspeakClient } from '../teamspeak'
import { ok, badRequest } from '../utils'

export async function getTeamspeakChannels(req: Request, res: Response) {
  const channels = await TeamspeakClient.instance.getChannels()

  return ok(res, channels)
}

export async function moveBotToChannel(req: Request, res: Response) {
  const { channelId } = req.params

  const channelIdParsed = parseInt(channelId)

  if (!channelIdParsed) return badRequest(res)

  await TeamspeakClient.instance.moveBotToChannel(channelIdParsed)

  return ok(res)
}

export async function getTeamspeakCurrentChannel(req: Request, res: Response) {}
