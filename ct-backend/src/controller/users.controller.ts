import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import userService from '@src/service/users.service';
import { modifySuc, serviceError, successObj, userIsNotExistsOrPassErr } from '@src/constant/resp.constant';
import env from "@src/config/default.config"
import { staticRoot } from '@src/app';

const { create, precisionFind, update, remove, find, verify } = userService;
const { SECRET, CSRF_SECRET, PORT } = env;

const DAY = 24 * 60 * 60 * 1000;

class UserController {
    registry(req: Request, resp: Response) {
        const { username, password, account } = req.body;
        precisionFind({ account })
            .then(res => {
                if (res && res.dataValues.id) {
                    resp.send({ code: 400, msg: "用户存在，换一个account名" });
                    return;
                }
                create({ username, password, account, id: null })
                    .then(() => {
                        resp.send(successObj)
                    })
                    .catch(err => {
                        console.error(`注册失败：${err}`);
                        resp.send(serviceError)
                    });
            })
            .catch(err => {
                console.error(`注册失败：${err}`);
                resp.send(serviceError)
            })
    }
    login(req: Request, resp: Response) {
        const { password, account } = req.body;
        verify({ account, password })
            .then(({ sc, id, username, intro, avatarSrc, account }) => {
                if (sc) {
                    resp
                        .cookie('ct_token', jwt.sign({ id }, SECRET!, { expiresIn: '15d' }), {
                            maxAge: 15 * DAY,
                            path: "/",
                            httpOnly: true
                        })
                        .cookie('csrf_session', jwt.sign({ id }, CSRF_SECRET!)) // 会话级别
                        .send({ code: 200, msg: "登录成功", data: { username, intro, avatarSrc, account, id } });
                } else {
                    resp.send(userIsNotExistsOrPassErr);
                }
            })
            .catch(err => {
                console.error(`登录失败：${err}`);
                resp.send(serviceError);
            })
    }
    logout(req: Request, resp: Response) {
        const { id, password } = req.body;
        verify({ id, password })
            .then(({ sc }) => {
                if (!sc) {
                    resp.send(userIsNotExistsOrPassErr);
                    return;
                }
                remove({ id })
                    .then(deleteRows => {
                        if (deleteRows == 1) {
                            resp.send({ code: 0, msg: "注销成功" });
                        } else {
                            resp.send(userIsNotExistsOrPassErr);
                        }
                    })
                    .catch(err => {
                        console.error(`注销失败：${err}`);
                        resp.send(serviceError);
                    })
            })
            .catch(err => {
                console.error(`注销失败：${err}`);
                resp.send(serviceError);
            })
    }
    search(req: Request, resp: Response) {
        const { username = "", page_num, page_size } = req.query;
        find(Number(page_size), Number(page_num), username as string)
            .then(res => {
                const users = res.map(r => r.dataValues);
                resp.send({ code: 0, msg: "查询成功", data: JSON.stringify(users) });
            })
            .catch(err => {
                console.error(`查询失败：${err}`);
                resp.send(serviceError);
            })
    }
    getSelfInfo(req: Request, resp: Response) {
        const { id } = req.body;
        precisionFind({ id })
            .then(res => {
                if (!res || res.dataValues.id != id) {
                    resp.send({ code: 400, msg: "没有该用户" });
                    return;
                }
                const { avatarSrc, biography, username, account } = res.dataValues
                resp
                    .cookie('csrf_session', jwt.sign({ id }, CSRF_SECRET!))
                    .send({ code: 200, msg: "获取个人信息成功", data: { avatarSrc, intro: biography, username, account, id } });
            })
            .catch(err => {
                console.error(`获取个人信息失败：${err}`);
                resp.send(serviceError);
            })
    }
    uploadPass(req: Request, resp: Response) {
        const { newPassword, password, id, account } = req.body;
        verify({ id, password, account })
            .then(({ sc }) => {
                if (!sc) {
                    resp.send({ code: 400, msg: '密码不正确或用户不存在' });
                    return;
                }
                update({ account, newPassword, id })
                    .then(() => {
                        resp
                            .cookie('csrf_session', '')
                            .cookie('ct_token', '')
                            .send(modifySuc);
                    })
                    .catch(err => {
                        console.error(`修改失败：${err}`);
                        resp.send(serviceError);
                    })
            })
            .catch(err => {
                console.error(`修改失败：${err}`);
                resp.send(serviceError);
            })
    }
    uploadInfo(req: Request, resp: Response) {
        const { username, intro } = req.body;
        const { account: _account, id: _id } = req.query;
        const account = String(_account), id = Number(_id);
        update({ account, id, username, biography: intro, avatarSrc: `http://localhost:${PORT}/${req.file?.path.replace(staticRoot, '').replace(/\\/g, '/')}` })
            .then(() => resp.send(modifySuc))
            .catch(err => {
                console.error(`修改失败：${err}`);
                resp.send(serviceError);
            })
    }
}

export default new UserController()