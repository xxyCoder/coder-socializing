import express, { type Request, Response } from "express";
import SseStream from "ssestream";

const router = express.Router();

const connectedUsers: WeakMap<String, SseStream> = new WeakMap()

export function getSSEConn(userId: number) {
    return connectedUsers.get(Object(userId))
}

router.get('/:userId', (req: Request, resp: Response) => {
    const { userId } = req.params;
    if (!Number.isInteger(userId)) {
        resp.send({ code: 400, msg: '连接失败' })
        return
    }
    console.log(`${userId} connect`)

    const sse = new SseStream(req)
    sse.pipe(resp)

    connectedUsers.set(Object(userId), sse);

    req.on('close', () => {
        console.log(`${userId} close connection`);
        connectedUsers.delete(Object(userId));
    })
})

export default router