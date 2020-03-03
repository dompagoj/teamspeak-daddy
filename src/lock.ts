import { writeFile, exists } from 'fs'
import { promisify } from 'util'

const isDev = process.env.NODE_ENV === 'dev'

export const lockFileDir = isDev ? './' : '/run/lock/'
export const lockFileName = isDev ? 'lockfile' : 'ljopi_discord_bot_lockfile'

const lockFilePath = lockFileDir + lockFileName

const writeFilePromise = promisify(writeFile)
const existsPromise = promisify(exists)

export async function createLock() {
  return writeFilePromise(lockFilePath, 1)
}

export async function lockExists() {
  return existsPromise(lockFilePath)
}
