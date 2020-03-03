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
  LJOPI_ONLINE = ljopi.presence.status === 'online'

  //@ts-ignore
  discord.on('raw', async (event: IRawEvent) => {
    if (event.t !== PRESENCE_UPDATE_EVENT) return

    const { d } = event as IRawEvent<IPresenceUpdateEvent>
    const { user } = d

    if (user.id !== LJOPI_DISCORD_ID) return

    logger.log('Ljopi changed status! ', d.status, JSON.stringify(d.client_status, null, 2))

    LJOPI_ONLINE = d.status === 'online'

    if (!LJOPI_ONLINE) return logger.log('Ljopi not online')
    if (await lockExists()) return logger.log('Lock exists')

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

    if (!LJOPI_ONLINE) return logger.log('Ljopi not online')
    if (await lockExists()) return logger.log('Lock exists...')

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
