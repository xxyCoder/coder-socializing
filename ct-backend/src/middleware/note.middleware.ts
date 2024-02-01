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