import { Server, Socket } from 'socket.io';
import env from '@src/config/default.config'

const { SOCKETPORT, REMOTEIP, REMOTEPORT } = env;

const sockets = new Map<number, Socket>()
export function getScoket(id: number) {
  return sockets.get(id)
}

export function establishConn() {
  const io = new Server(Number(SOCKETPORT), {
    cors: {
      origin: [`${REMOTEIP}:${REMOTEPORT}`]
    }
  })

  io.on('connection', socket => {
    socket.on('online', id => {
      if (!Number.isInteger(id)) return
      sockets.set(id, socket)
    })

    socket.on('send', ({ id, data }) => {
      const sk = sockets.get(id)
      if (sk) {
        sk.emit('reply', data)
      }
    })

    socket.on('offline', id => {
      if (!Number.isInteger(id)) return
      sockets.delete(id)
    })
  })

}