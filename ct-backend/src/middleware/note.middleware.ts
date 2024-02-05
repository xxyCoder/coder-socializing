import { importArgsIsNull } from "@src/constant/resp.constant";
import type { NextFunction, Request, Response } from "express";

export const checkLikeParams = (req: Request, res: Response, next: NextFunction) => {
    const { noteId, is_like } = req.body
    if (Number.isNaN(Number(noteId)) || !['false', 'true'].includes(is_like)) {
        res.send(importArgsIsNull)
        return
    }
    next()
}

const tags = ['new', 'learn', 'game', 'help', 'food']
export const checkNoteParams = (req: Request, res: Response, next: NextFunction) => {
    const { tag, title, is_video } = req.body;
    const mediaList = req.files;
    if (!tags.includes(tag) || !title || !mediaList || mediaList.length === 0 || !['false', 'true'].includes(is_video)) {
        res.send({ code: 400, msg: '信息不完整' });
        return;
    }
    next();
}