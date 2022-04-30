// Family Chat
//

import * as WebSocket from 'ws'

const validateEvent = ['offer', 'answer']

export class FCChannel {
  private channelName = ''
  private credential = ''
  private maxCount = 12
  private users = new Map<string, WebSocket>()

  constructor(name: string, credential: string) {
    this.channelName = (' ' + name).slice(1)
    this.credential = (' ' + credential).slice(1)
  }

  hasCredential = () => {
    return (this.credential !== '')
  }

  canJoin = (credential: string) => {
    return (this.credential === credential) && (this.users.size < this.maxCount)
  }

  get name(): string {
    return this.channelName
  }

  get userCount(): number {
    return this.users.size
  }

  join = (nickname: string, ws : WebSocket) => {
    this.users.set(nickname, ws)
    ws.on('close', () => {
      this.users.delete(nickname)
      this.broadcastExcept(nickname, JSON.stringify({event: 'bye', user: nickname}))
      ws.removeAllListeners()
    })
    ws.on('error', () => {
      this.users.delete(nickname)
      this.broadcastExcept(nickname, JSON.stringify({event: 'bye', user: nickname}))
      ws.removeAllListeners()
    })
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message)
        if (!data['user'] || this.users.has(<string>data['user'])) {
          console.error('websocket send message not match the user')
          ws.close()
          return
        }
        if (!data['target']) {
          console.error('websocket not validate, message')
          ws.close()
          return
        }
        if (!data['message']) {
          console.error('websocket missing message to send')
          ws.close()
          return
        }
        if (!data['event'] || !validateEvent.includes(<string>data['event'])) {
          console.error('websocket send invalidate event')
          ws.close()
          return
        }
        if (this.users.has(<string>data['target'])) {
          this.users.get(<string>data['target'])?.send(message)
        }
      } catch(e) {
        console.error('message from websocket is not json string', e)
        ws.close()
      }
    })
    this.broadcastExcept(nickname, JSON.stringify({event: 'hello', user: nickname}))
  }

  private broadcastExcept = (nickname: string, message: string) => {
    this.users.forEach((ws: WebSocket, name: string) => {
      if (name === nickname) return
      ws.send(message)
    })
  }
}