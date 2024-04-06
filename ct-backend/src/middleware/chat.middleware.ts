import { NextFunction, Request, Response } from "express";

export const checkChatReceiverId = (req: Request, resp: Response, next: NextFunction) => {
    const { receiverId } = req.body

    if (Number.isNaN(receiverId)) {
        resp.send({ code: 400, msg: '不存在接收者' })
        return
    }
    next()
}

export const checkChatContent = (req: Request, resp: Response, next: NextFunction) => {
    const { content } = req.body
    if (!content) {
        resp.send({ code: 400, msg: '发送消息不能为空' })
        return
    }
    next()
}
