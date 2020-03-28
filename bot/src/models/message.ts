import { IsNotEmpty, Length, MaxLength } from 'class-validator'
import { IMessage, IMessageCreate } from '../types/message'

export class MessageUpdate implements IMessage {
  @IsNotEmpty()
  id: number

  @IsNotEmpty()
  @MaxLength(50)
  content: string

  @IsNotEmpty()
  @MaxLength(500)
  trigger: string

  public constructor(id: number, content: string, trigger: string) {
    this.id = id
    this.content = content
    this.trigger = trigger
  }

  public static fromObject(message: IMessage) {
    const { id, content, trigger } = message

    return new MessageUpdate(id, content, trigger)
  }
}

export class MessageCreate implements IMessageCreate {
  @IsNotEmpty()
  @MaxLength(50)
  public trigger: string

  @IsNotEmpty()
  @MaxLength(500)
  public content: string

  constructor(trigger: string, content: string) {
    this.trigger = trigger
    this.content = content
  }

  public static fromObject(message: IMessageCreate) {
    const { trigger, content } = message

    return new MessageCreate(trigger, content)
  }
}
