import { NextFunction, Request, Response } from "express";

export const checkCommentContent = (req: Request, resp: Response, next: NextFunction) => {
  const { comment } = req.body
  if (!comment) {
    resp.send({ code: 400, msg: '评论内容不能为空' });
    return;
  }
  req.body.comment = decodeURIComponent(comment)
  next();
}

export const checkCommentIdExists = (req: Request, resp: Response, next: NextFunction) => {
  const { commentId } = req.query
  if (Number.isNaN(Number(commentId))) {
    resp.send({ code: 400, msg: '没有通知评论' })
    return
  }
  next()
}