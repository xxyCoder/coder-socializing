import { Follow } from "@src/constant/concern.constant";
import { importArgsIsNull } from "@src/constant/resp.constant";
import type { NextFunction, Request, Response } from "express";

export const checkFollwerParams = (req: Request, res: Response, next: NextFunction) => {
  const { id, viewer_id, is_follwer } = req.body
  if (!id || !viewer_id || ![true, false].includes(is_follwer)) {
    return res.send(importArgsIsNull);
  }
  next()
}


export const checkFollowIdx = (req: Request, res: Response, next: NextFunction) => {
  const idx = Number(req.query.idx)
  if (Number.isNaN(idx) || !(idx in Follow)) {
    return res.send(importArgsIsNull)
  }
  next()
}

export const checkFollowViewerId = (req: Request, res: Response, next: NextFunction) => {
  const viewer_id = Number(req.query.viewer_id)
  if (Number.isNaN(viewer_id)) {
    return res.send(importArgsIsNull)
  }
  next()
}