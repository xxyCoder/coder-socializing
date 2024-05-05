import { importArgsIsNull } from "@src/constant/resp.constant";
import { categories } from "@src/constant/types";
import type { NextFunction, Request, Response } from "express";

export const checkLikeOrCollectParams = (req: Request, res: Response, next: NextFunction) => {
  const { noteId, is_like, is_collect, type, authorId } = req.body
  if (Number.isNaN(Number(noteId)) || Number.isNaN(Number(authorId)) || !['collect', 'like'].includes(type) || (type === 'collect' && ![false, true].includes(is_collect)) || (type === 'like' && ![false, true].includes(is_like))) {
    res.send(importArgsIsNull)
    return
  }
  next()
}

export const checkTagIsValid = (req: Request, res: Response, next: NextFunction) => {
  let { category } = req.body;
  if (!category) category = req.query.category;

  (category as string) in categories ? next() : res.send({ code: 400, msg: '类型错误' });
}

export const checkNoteParams = (req: Request, res: Response, next: NextFunction) => {
  const { title, is_video } = req.body;
  if (!title || !['false', 'true'].includes(is_video)) {
    res.send(importArgsIsNull)
    return
  }
  next();
}

export const checkNoteIdExists = (req: Request, res: Response, next: NextFunction) => {
  let { noteId } = req.query;
  !noteId && ({ noteId } = req.body);
  if (Number.isNaN(Number(noteId))) {
    res.send(importArgsIsNull)
    return
  }
  next()
}