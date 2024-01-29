import { importArgsIsNull } from "@src/constant/resp.constant";
import type { NextFunction, Request, Response } from "express";

export const checkFollwerParams = (req: Request, res: Response, next: NextFunction) => {
    const { id, viewer_id, is_follwer } = req.body
    if (!id || !viewer_id || !['true', 'false'].includes(is_follwer)) {
        res.send(importArgsIsNull);
        return;
    }
    next()
}
