// Family Chat
//

import { FCChannel } from "./channel";

export class FCChannelManager {
  private channels = new Map<string, FCChannel>()

  constructor() {
    setInterval(() => {
      this.checkIdelChannel()
    }, 1000)
  }

  getChannel = (name: string) => {
    return this.channels.get(name)
  }

  createChannel = (name: string, credential: string) => {
    this.channels.set(name, new FCChannel(name, credential))
    return this.channels.get(name)
  }

  private checkIdelChannel = () => {
    const idleChannels = new Array<string>()
    this.channels.forEach((c: FCChannel, n: string) => {
      if (c.userCount === 0) {
        idleChannels.push((' ' + n).slice(1))
      }
    })
    idleChannels.forEach((n: string) => {
      this.channels.delete(n)
    })
  }
}

export const channelManager = new FCChannelManager()