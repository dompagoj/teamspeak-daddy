import { Request, Response } from 'express'

import * as DB from '../db/connection'
import { badRequest, ok } from '../utils'
import { MessageCreate } from '../models/message'
import { validate } from 'class-validator'

export async function getMessages(req: Request, res: Response) {
  const messages = await DB.getMessages()

  return ok(res, messages)
}

export async function getMessage(req: Request, res: Response) {
  const { id } = req.params
  const idParsed = parseInt(id)
  if (!idParsed) return badRequest(res)

  const message = await DB.getMessageById(parseInt(id))

  return ok(res, message)
}

export async function createMessage(req: Request, res: Response) {
  console.log('Req body: ', req.body)

  const message = MessageCreate.fromObject(req.body)

  const errors = await validate(message)

  if (errors && errors.length) return badRequest(res, errors[0].constraints)

  await DB.createMessage(message)

  return ok(res)
}

export async function updateMessage(req: Request, res: Response) {}

export async function deleteMessage(req: Request, res: Response) {}
