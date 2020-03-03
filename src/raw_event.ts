import { PresenceStatusData, ClientPresenceStatusData } from 'discord.js'

export interface IRawEvent<T = any> {
  t?: string
  s?: number
  op: number
  d: T
}

export interface IPresenceUpdateEvent {
  user: {
    username: string
    id: string
    discriminator: string
    avatar?: string
  }
  status: PresenceStatusData
  last_modified: number
  game?: string
  client_status?: ClientPresenceStatusData
  activities: any[]
}
