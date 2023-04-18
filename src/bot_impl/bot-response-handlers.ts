import { TextMessage } from 'ts3-nodejs-library/lib/types/Events'
import * as DB from '../db/connection'
import { TeamspeakClient } from '../teamspeak'
import { BOT_COMMANDS } from './commands'

export async function handleTeamspeakMessage({ msg, invoker }: TextMessage) {
  if (!msg.startsWith('daddy,')) return

  let [_, trigger] = msg.split('daddy,')
  trigger = trigger.trim()

  const [command, ...params] = trigger.split(' ')

  const foundCommand = BOT_COMMANDS[command]

  if (foundCommand) return foundCommand.handler(invoker, params.join(' ').trim())

  const message = await DB.getMessageByTrigger(trigger)
  const { instance: teamspeak } = TeamspeakClient
  // if (!message) // TODO
  // return teamspeak.sendMessageToChannel(invoker. `Nekuzim kaj je "${trigger}" pogledaj kaj sve postoji idiote`)

  // return teamspeak.sendMessageToChannel(message.content)
}
