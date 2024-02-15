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

const tags = ['new', 'learn', 'game', 'help', 'food'];
export const checkTagIsValid = (req: Request, res: Response, next: NextFunction) => {
    let { tag } = req.body;
    if (!tag) tag = req.query.tag;
    if (!tags.includes(tag)) {
        res.send(importArgsIsNull)
        return
    }
    next();
}

export const checkNoteParams = (req: Request, res: Response, next: NextFunction) => {
    const { title, is_video } = req.body;
    const mediaList = req.files;
    if (!title || !mediaList || mediaList.length === 0 || !['false', 'true'].includes(is_video)) {
        res.send(importArgsIsNull)
        return
    }
    next();
}

export const checkNoteIdExists = (req: Request, res: Response, next: NextFunction) => {
    const { noteId } = req.query;
    if (Number.isNaN(Number(noteId))) {
        res.send(importArgsIsNull)
        return
    }
    next()
}