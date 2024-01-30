import { importArgsIsNull } from "@src/constant/resp.constant";
import type { NextFunction, Request, Response } from "express";

export const checkLikeParams = (req: Request, res: Response, next: NextFunction) => {
    const { note_id, is_like } = req.body
    if (!note_id || !['false', 'true'].includes(is_like)) {
        res.send(importArgsIsNull)
        return
    }
    next()
}