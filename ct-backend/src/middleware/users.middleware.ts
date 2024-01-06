import { importArgsIsNull } from '@src/constant/resp.constant';
import bcrpty from 'bcryptjs'
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express'
import env from '@src/config/default.config'

const { SECRET } = env;

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
    const { username, newPassword } = req.body;
    if (!username && !newPassword) {
        res.send({ code: 400, msg: "至少有一个参数不能为空" });
        return;
    }
    next();
}

export const crpytPassword = (req: Request, res: Response, next: NextFunction) => {
    let { password, newPassword } = req.body;
    if(!newPassword) newPassword = password;
    const salt = bcrpty.genSaltSync(10)
    const hash = bcrpty.hashSync(newPassword, salt) // hash保存的是密文
    req.body.password = hash
    next();
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.send({
            code: 400,
            msg: "没有token"
        });
        return;
    }
    const token = authorization.replace("Bearer ", '');
    try {
        const { id } = req.body;
        const user = jwt.verify(token, SECRET!) as { id: number }
        if (id == user.id) next();
        else res.send({ code: 400, msg: "token不正确" })
    } catch (err: any) {
        switch (err.name) {
            case 'TokenExpiredError':
                res.send({ code: 400, msg: "token过期" });
                break;
            case 'JsonWebTokenError':
                res.send({ code: 400, msg: "无效token" });
                break;
        }
    }
}

export const checkPageParams = (req: Request, res: Response, next: NextFunction) => {
    const { page_num, page_size } = req.query;
    if (!page_num || !page_size) {
        res.send(importArgsIsNull);
        return;
    }
    next();
}
