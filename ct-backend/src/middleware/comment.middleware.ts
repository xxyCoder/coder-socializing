import { NextFunction, Request, Response } from "express";

export const checkCommentContent = (req: Request, resp: Response, next: NextFunction) => {
    const { comment } = req.body
    if (!comment) {
        resp.send({ code: 400, msg: '评论内容不能为空' });
        return;
    }
    next();
}
