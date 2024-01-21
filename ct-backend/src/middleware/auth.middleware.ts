import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import env from "@src/config/default.config"
import { csrfSessionError, csrfSessionIsNull, csrfSessionLapse, csrfSessionTimeout, tokenError, tokenIsNull, tokenLapse, tokenTimeout } from "@src/constant/resp.constant";

const { CSRF_SECRET, SECRET } = env;

export function verifyToken(req: Request, resp: Response, next: NextFunction) {
    const token = req.cookies["ct_token"];
    if (!token) {
        resp.send(tokenIsNull)
        return;
    }
    try {
        const user = jwt.verify(token, SECRET!) as { id: number }
        req.body.id = user.id;
        next();
    } catch (err: any) {
        switch (err.name) {
            case 'TokenExpiredError':
                resp.send(tokenTimeout);
                break;
            case 'JsonWebTokenError':
                resp.send(tokenLapse);
                break;
        }
    }
}

export function verifyCSRFSession(req: Request, resp: Response, next: NextFunction) {
    const { id } = req.body;
    const csrf_session = req.cookies['csrf_session']

    if (!csrf_session) {
        resp.send(csrfSessionIsNull);
        return;
    }
    const user = jwt.verify(csrf_session, CSRF_SECRET!) as { id: number }
    try {
        if (id == user.id) next();
        else resp.send(csrfSessionError);
    } catch (err: any) {
        switch (err.name) {
            case 'TokenExpiredError':
                resp.send(csrfSessionTimeout);
                break;
            case 'JsonWebTokenError':
                resp.send(csrfSessionLapse);
                break;
        }
    }
}

export function addCustomHeader(req: Request, resp: Response, next: NextFunction) {
    resp.set("Access-Control-Expose-Headers", "X-CSRF-Session");
    next();
}