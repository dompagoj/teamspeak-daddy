import { Pool } from 'pg'
import * as Queries from './queries'
import { IMessage, IMessageCreate } from '../types/message'
import { config } from '../config'

export const DBConnection = new Pool({
  password: config.dbPassword,
  user: config.dbUser,
  database: config.dbDatabaseName,
  port: 5430,
})

export async function getMessages(): Promise<IMessage[]> {
  const { rows } = await DBConnection.query(Queries.GET_MESSAGES)

  return rows
}

export async function getMessageById(id: number): Promise<IMessage | undefined> {
  const { rows } = await DBConnection.query(Queries.GET_MESSAGE_BY_ID, [id])

  return rows?.[0]
}

export async function getMessageByTrigger(trigger: string): Promise<IMessage | undefined> {
  const { rows } = await DBConnection.query(Queries.GET_MESSAGES_BY_TRIGGER, [trigger])

  return rows?.[0]
}

export async function createMessage(message: IMessageCreate) {
  const { trigger, content } = message
  const { rows } = await DBConnection.query(Queries.CREATE_MESSAGE, [trigger, content])

  return rows[0].id
}
