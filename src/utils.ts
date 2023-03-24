import { Response } from 'express'
import * as HttpStatus from 'http-status-codes'

export async function badRequest(res: Response, msg?: any) {
  return res.status(HttpStatus.BAD_REQUEST).json(msg)
}

export async function ok(res: Response, json?: any) {
  return res.status(HttpStatus.OK).json(json)
}

export async function notFound(res: Response, msg?: string) {
  return res.status(HttpStatus.NOT_FOUND).json(msg)
}
