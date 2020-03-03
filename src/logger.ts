import { createWriteStream, WriteStream } from 'fs'
import { config } from './config'

interface LoggerOpts {
  logPath: string
  skipFile: boolean
  name?: string
}

interface Loggable {
  toString(): string
}

const defaultOpts: LoggerOpts = {
  logPath: './log.txt',
  skipFile: !config.env.isProd()
}

export class Logger {
  private writeStream?: WriteStream

  constructor(public opts = defaultOpts) {
    if (!this.opts.skipFile) this.writeStream = createWriteStream(opts.logPath, { flags: 'a' })
  }

  private transform(data: string) {
    const timestamp = new Date().toUTCString()

    return `${timestamp} : ${data} \n\n`
  }

  public log(...data: Loggable[]) {
    const transformed = this.transform(data.join(''))

    console.log(transformed)

    if (this.writeStream) this.writeStream.write(transformed)
  }
}
