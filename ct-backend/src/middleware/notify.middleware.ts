import { InteractionTypeMap } from "@src/constant/notify";
import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";

export const checkTagRight = (req: Request, resp: Response, next: NextFunction) => {
  let tag = req.query.tag as InteractionTypeMap
  !tag && (tag = req.body.tag)
  if (!(tag in InteractionTypeMap)) {
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
