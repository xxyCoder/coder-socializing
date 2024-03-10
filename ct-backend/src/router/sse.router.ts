import express, { type Request, Response } from "express";
import SseStream from "ssestream";

const router = express.Router();

const connectedUsers: Map<string, SseStream> = new Map()

export function getSSEConn(userId: string) {
    return connectedUsers.get(userId)
}

router.get('/:userId', (req: Request, resp: Response) => {
    const { userId } = req.params;
    console.log(`${userId} connect`)

    const sse = new SseStream(req)
    sse.pipe(resp)

    connectedUsers.set(userId, sse);

    req.on('close', () => {
        console.log(`${userId} close connection`);
        connectedUsers.delete(userId);
    })
})

export default router