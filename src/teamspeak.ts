import { TeamSpeak } from 'ts3-nodejs-library'
import { config } from './config'

export const DOMPAGOJ_TS_ID = 2
export const LJOPI_TS_ID = 4

export class TeamspeakClient {
  constructor(private teamspeak: TeamSpeak) {}

  public static async initialize() {
    const teamspeak = await TeamSpeak.connect({
      host: config.tsServerIp,
      username: config.tsUsername,
      password: config.tsPassword,
      queryport: 10011, //optional
      serverport: 9987,
      nickname: 'Choke me daddy'
    })

    teamspeak.registerEvent('server')
    teamspeak.registerEvent('channel', 0)

    return new TeamspeakClient(teamspeak)
  }

  public get instance() {
    return this.teamspeak
  }

  public getDbUsers() {
    return this.teamspeak.clientDBList()
  }

  public getOnlineUsers() {
    return this.teamspeak.clientList()
  }

  public getDompa() {
    return this.teamspeak.getClientByDBID(DOMPAGOJ_TS_ID)
  }

  public getLjopi() {
    return this.teamspeak.getClientByDBID(LJOPI_TS_ID)
  }

  public async shouldSendToLjopi() {
    const dompagojOnline = !!(await this.getDompa())
    const ljopiOnline = !!(await this.getLjopi())

    return dompagojOnline && !ljopiOnline
  }

  public destroy() {
    return this.teamspeak.quit()
  }
}
