import { FrontNotifyTypeMap } from "@src/constant/notify";
import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";

export const checkTypeRight = (req: Request, resp: Response, next: NextFunction) => {
    const type = req.query.type as FrontNotifyTypeMap
    if (![FrontNotifyTypeMap["comment-at"], FrontNotifyTypeMap.concern, FrontNotifyTypeMap["thumb-collet"]].includes(type)) {
        resp.send(importArgsIsNull)
        return
    }
    next()
}
