export interface IMessage {
  id: number
  content: string
  trigger: string
}

export interface IMessageCreate {
  content: string
  trigger: string
}
