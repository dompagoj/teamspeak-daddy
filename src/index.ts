import { Client, Presence } from 'discord.js'
import { existsSync } from 'fs'

import { IRawEvent, IPresenceUpdateEvent } from './raw_event'
import { createLock, lockFileDir, lockExists } from './lock'
import { Logger } from './logger'
import { TeamspeakClient, DOMPAGOJ_TS_ID } from './teamspeak'

let discord: Client
let teamspeak: TeamspeakClient

let LJOPI_ONLINE: boolean = false

const DOMPAGOJ_DISCORD_ID = '561582150739296266' // For testing only
const LJOPI_DISCORD_ID = '309808983718363146'
const PRESENCE_UPDATE_EVENT = 'PRESENCE_UPDATE'

const logger = new Logger()

async function main() {
  console.log(lockFileDir)
  if (!existsSync(lockFileDir)) {
    console.error(`Directory ${lockFileDir} doesn't exists`)
    process.exit(1)
  }

  await initializeClients()
  logger.log('Logged in!')

  const ljopi = await discord.fetchUser(LJOPI_DISCORD_ID)
  LJOPI_ONLINE = isOnlineFromPresence(ljopi.presence)

  //@ts-ignore
  discord.on('raw', async (event: IRawEvent) => {
    if (event.t !== PRESENCE_UPDATE_EVENT) return

    const { d } = event as IRawEvent<IPresenceUpdateEvent>
    const { user } = d

    if (user.id !== LJOPI_DISCORD_ID) return

    logger.log('Dompagoj changed status!')

    LJOPI_ONLINE = d.status === 'online' && (d.client_status?.desktop === 'online' || d.client_status?.web === 'online')

    if (!LJOPI_ONLINE || (await lockExists())) {
      return logger.log('Ljopi either not online or lock active')
    }

    if (!(await teamspeak.shouldSendToLjopi())) {
      return logger.log('teamspeak.shouldSendToLjopi is false')
    }

    const ljopi = await discord.fetchUser(LJOPI_DISCORD_ID)

    logger.log('Sending to ljopi and creating lock!')
    await ljopi.send('Ts')
    await createLock()
  })

  teamspeak.instance.on('clientconnect', async ({ client }) => {
    if (client.clid !== DOMPAGOJ_TS_ID) return

    logger.log('Dompagoj connected to ts!')

    if (!LJOPI_ONLINE || (await lockExists())) {
      return logger.log('Ljopi either not online or lock active')
    }

    if (!!(await teamspeak.getLjopi())) {
      return logger.log('Ljopi is already on teamspeak')
    }

    const ljopi = await discord.fetchUser(LJOPI_DISCORD_ID)

    logger.log('Sending to ljopi and creating lock!')
    await ljopi.send('Ts')
    await createLock()
  })

  logger.log('Listening...')
}

main().catch(console.error)

process.on('SIGINT', async () => {
  console.log('Cleaning connection')
  await Promise.all([discord.destroy(), teamspeak.destroy()])
  console.log('Done!')

  process.exit()
})

async function initializeClients() {
  discord = new Client()
  const [teamspeakClient] = await Promise.all([TeamspeakClient.initialize(), discord.login()])
  teamspeak = teamspeakClient
}

function isOnlineFromPresence({ status, clientStatus }: Presence) {
  return status === 'online' && (clientStatus?.desktop === 'online' || clientStatus?.web === 'online')
}
