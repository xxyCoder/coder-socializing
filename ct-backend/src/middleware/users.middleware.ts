import { importArgsIsNull } from '@src/constant/resp.constant';
import bcrpty from 'bcryptjs'
import type { Request, Response, NextFunction } from 'express'

export const checkIdAndPassExists = (req: Request, res: Response, next: NextFunction) => {
    const { id, password } = req.body;
    if (!id || !password) {
        res.send(importArgsIsNull);
        return;
    }
    next();
}

export const checkFormParams = (req: Request, res: Response, next: NextFunction) => {
    const { password, account } = req.body;
    if (!password || !account) {
        res.send(importArgsIsNull);
        return;
    }
    next();
}

export const checkAllParamsIsNull = (req: Request, res: Response, next: NextFunction) => {
    const { username, newPassword, intro, avatarSrc } = req.body;
    if (!username && !intro && !avatarSrc && !newPassword) {
        res.send({ code: 400, msg: "至少有一个参数不能为空" });
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

export const checkPageParams = (req: Request, res: Response, next: NextFunction) => {
    const { page_num, page_size } = req.query;
    if (!page_num || !page_size) {
        res.send(importArgsIsNull);
        return;
    }
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
        res.send(importArgsIsNull);
        return;
    }
    next()
}