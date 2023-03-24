import { Router } from "express"
import { getMessages, getMessage, createMessage, updateMessage, deleteMessage } from "../controllers/messages-controller"

export const MessageRouter = Router()

MessageRouter.get('/', getMessages)
MessageRouter.get('/:id', getMessage)

MessageRouter.post('/', createMessage)
MessageRouter.put('/:id', updateMessage)
MessageRouter.delete('/:id', deleteMessage)