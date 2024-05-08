import express, { type Request, Response } from "express";
import SseStream from "ssestream";

const router = express.Router();

const connectedUsers: Map<number, SseStream> = new Map()

export function getSSEConn(userId: number) {
  return connectedUsers.get(userId)
}

router.get('/:userId', (req: Request, resp: Response) => {
  const { userId } = req.params;
  if (!Number.isInteger(Number(userId))) {
    resp.send({ code: 400, msg: '连接失败', data: {} })
    return
  }
  console.log(`${userId} connect`)

  const sse = new SseStream(req)
  sse.pipe(resp)

  connectedUsers.set(Number(userId), sse);

  req.on('close', () => {
    console.log(`${userId} close connection`);
    connectedUsers.delete(Object(userId));
  })
})

export default router