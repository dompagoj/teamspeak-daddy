import { TeamSpeakClient } from 'ts3-nodejs-library'
import * as Mathjs from 'mathjs'

import * as DB from '../db/connection'
import { TeamspeakClient } from '../teamspeak'

interface BotCommandsMap {
  [key: string]: {
    handler: (invoker: TeamSpeakClient, params: string) => Promise<any> | undefined
    description: string
  }
}

export const BOT_COMMANDS: BotCommandsMap = {
  poruke: {
    handler: getAllMessages,
    description: 'Prikazi sve poruke',
  },
  naredbe: {
    handler: getAllCommands,
    description: 'Prikazi sve naredbe',
  },
  poke_all: {
    handler: pokeAll,
    description: 'Pokaj sve ljude (eg. b! poke_all <poruka> )',
  },
  izracunaj: {
    handler: mathEvaluate,
    description: 'Daddy rijesava bilo kakvu matematiku',
  },
  dodaj: {
    handler: addMessage,
    description: 'Dodaj poruku (eg. daddy, dodaj <ime poruke> : <odgovor daddyia>)',
  },
}

async function send(msg: string) {
  return TeamspeakClient.instance.sendMessageToChannel(msg)
}

async function getAllMessages(invoker: TeamSpeakClient, params: string) {
  const messages = await DB.getMessages()

  const msgFormatted = messages.map(m => `${m.trigger}: ${m.content}`).join('\n')

  return send('\n' + msgFormatted)
}

async function pokeAll(invoker: TeamSpeakClient, msg: string) {
  const teamspeak = TeamspeakClient.instance

  if (!(await teamspeak.isClientServerAdmin(invoker))) {
    return send('Poke all moze zvat samo server admin :D ')
  }

  console.log('Poking all! ', msg)
  const clients = await teamspeak.getOnlineUsers()

  return clients.map(client => {
    // causes invalid client type exception, not sure why
    if (client.cid !== TeamspeakClient.whoami.client_id) return client.poke(msg)
  })
}

async function getAllCommands(invoker: TeamSpeakClient, _: string) {
  const commands = Object.entries(BOT_COMMANDS)
    .map(([name, { description }]) => `${name}: ${description}`)
    .join('\n')

  return send('\n' + commands)
}

async function mathEvaluate(invoker: TeamSpeakClient, expr: string) {
  console.log('Mathjs evaluating: ', expr)
  try {
    const result = Mathjs.evaluate(expr)

    return send(result?.toString())
  } catch (e) {
    console.log(e)

    return send('Neznam to izracunati :( ')
  }
}

async function addMessage(invoker: TeamSpeakClient, param: string) {
  if (!param.includes(':')) return send('(eg. daddy, dodaj <ime poruke> : <odgovor daddyia> )')

  const [trigger, content] = param.split(':')

  await DB.createMessage({ trigger, content })

  return send(`Poruka ${trigger} je napravljena sa odgovorom: ${content}`)
}
