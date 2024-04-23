import { InteractionTypeMap } from "@src/constant/notify";
import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";

export const checkTypeRight = (req: Request, resp: Response, next: NextFunction) => {
  const type = Number(req.query.type) as InteractionTypeMap
  if (![InteractionTypeMap["comment-at"], InteractionTypeMap.concern, InteractionTypeMap["thumb-collet"], InteractionTypeMap["self-comment"]].includes(type)) {
    resp.send(importArgsIsNull)
    return
  }
  next()
}

export const checkNotifyIdExists = (req: Request, resp: Response, next: NextFunction) => {
  const { notifyId } = req.body;
  if (!notifyId) {
    resp.send(importArgsIsNull)
    return
  }
  next()
}
