import express from 'express'
import bodyParser from 'body-parser'

import { TeamspeakClient } from './teamspeak'
import { config } from './config'
import { DBConnection } from './db/connection'
import { ApiRouter } from './routers/api-router'

async function main() {
  await Promise.all([await TeamspeakClient.initialize(), DBConnection.connect()])

  const app = express()
  app.use(bodyParser.json())
  app.use(ApiRouter)
  app.listen(config.port, () => console.log(`Server listeting on port ${config.port}`))
}

main().catch(console.error)

process.on('SIGINT', async () => {
  console.log('Cleaning connections')
  await TeamspeakClient.instance.destroy()
  console.log('Done!')

  process.exit()
})
