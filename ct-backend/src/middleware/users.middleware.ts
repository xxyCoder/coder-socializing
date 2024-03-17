import { importArgsIsNull } from '@src/constant/resp.constant';
import bcrpty from 'bcryptjs'
import type { Request, Response, NextFunction } from 'express'

export const checkFormParams = (req: Request, res: Response, next: NextFunction) => {
    const { password, account } = req.body;
    if (!password || !account) {
        res.send(importArgsIsNull);
        return;
    }
    next();
}

export const crpytPassword = (req: Request, res: Response, next: NextFunction) => {
    let { password, newPassword } = req.body;
    if (!newPassword) newPassword = password;
    const salt = bcrpty.genSaltSync(10)
    const hash = bcrpty.hashSync(newPassword, salt) // hash保存的是密文
    if (req.body.newPassword) req.body.newPassword = hash
    else req.body.password = hash
    next();
}

export const checkPassParams = (req: Request, res: Response, next: NextFunction) => {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        res.send(importArgsIsNull);
        return;
    }
    next();
}

export const checkIdAndAccountExists = (req: Request, res: Response, next: NextFunction) => {
    const { id, account } = req.query;
    if (!id || !account) {
        res.send({ code: 400, msg: '请先登录' });
        return;
    }
    req.body.id = Number(id), req.body.account = String(account)
    next()
}

export const checkViewIdExists = (req: Request, res: Response, next: NextFunction) => {
    const { viewer_id } = req.query
    if (!viewer_id) {
        res.send(importArgsIsNull);
        return;
    }
    next()
}
