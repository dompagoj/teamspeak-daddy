import { TeamSpeak, TextMessageTargetMode, TeamSpeakChannel, TeamSpeakClient, ClientType } from 'ts3-nodejs-library'
import { config } from './config'
import { Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes'
import { handleTeamspeakMessage } from './bot_impl/bot-response-handlers'

const SERVER_ADMIN_GROUP_ID = 17

export class TeamspeakClient {
  private static _instance: TeamspeakClient
  public static currentChannel: TeamSpeakChannel
  public static whoami: Whoami

  private constructor(private teamspeak: TeamSpeak) {}

  public static async initialize() {
    if (this._instance) return this._instance

    console.log('Connecting to ts...')
    const teamspeak = await TeamSpeak.connect({
      host: config.tsServerIp,
      username: config.tsUsername,
      password: config.tsPassword,
      queryport: 10011,
      serverport: 9987,
      nickname: 'Daddy',
    })
    console.log('Connected!')

    this.whoami = await teamspeak.whoami()
    // @ts-ignore
    this.currentChannel = await teamspeak.getChannelByID(this.whoami.client_channel_id)

    teamspeak.registerEvent('server')
    teamspeak.registerEvent('channel')
    teamspeak.registerEvent('textserver')
    teamspeak.registerEvent('textchannel')
    teamspeak.registerEvent('textprivate')

    this._instance = new TeamspeakClient(teamspeak)

    teamspeak.on('textmessage', handleTeamspeakMessage)

    return this._instance
  }

  public static get instance() {
    return TeamspeakClient._instance
  }

  public static get raw() {
    return this._instance.teamspeak
  }

  public getDbUsers() {
    return this.teamspeak.clientDbList()
  }

  public getOnlineUsers() {
    return this.teamspeak.clientList()
  }

  public destroy() {
    return this.teamspeak.quit()
  }

  public async changeNickname(clientNickname: string) {
    return this.teamspeak.clientUpdate({ clientNickname })
  }

  public async sendMessageToChannel(msg: string) {
    await this.teamspeak.sendTextMessage(1, TextMessageTargetMode.CHANNEL, msg)
  }

  public async getServerGroups() {
    return this.teamspeak.serverGroupList()
  }

  public async isClientInGroup(client: TeamSpeakClient.ClientType, group: number | string) {
    const groups = await this.teamspeak.serverGroupsByClientId(client)

    return groups.find(g => (typeof group === 'string' ? g.name : g.cldbid) === group)
  }

  public async isClientServerAdmin(client: TeamSpeakClient) {
    return !!client.servergroups?.find(g => g === SERVER_ADMIN_GROUP_ID.toString())
  }

  public async moveBotToChannel(channelId: string | TeamSpeakChannel) {
    const channel = typeof channelId === 'string' ? await this.teamspeak.getChannelById(channelId) : channelId
    if (!channel) return

    await this.teamspeak.clientMove(TeamspeakClient.whoami.clientId, channel.cid)
    TeamspeakClient.currentChannel = channel
  }

  public async getChannels() {
    return this.teamspeak.channelList()
  }
}
