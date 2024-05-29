import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserService from '@src/service/users.service';
import ConcernsService from '@src/service/concerns.service';
import LikesCollectServe from '@src/service/likes-collect.serve';
import NotesService from '@src/service/notes.service';
import { modifySuc, serviceError, successObj, userIsNotExists, userIsNotExistsOrPassErr } from '@src/constant/resp.constant';
import env from "@src/config/default.config"
import { staticRoot } from '@src/app';
import { categories } from '@src/constant/types';

const { create, precisionFind, update, verify, find } = UserService;
const { get: getIsLikeOrCollect, count: countLikesOrCollect } = LikesCollectServe;
const { search: judgeIsFollower } = ConcernsService;
const { getByPage: getUserNotesByPage } = NotesService

const { SECRET, PORT } = env;

const DAY = 24 * 60 * 60 * 1000;

class UserController {
  registry(req: Request, resp: Response) {
    let { username, password, account } = req.body;
    username = decodeURIComponent(username)
    account = decodeURIComponent(account)
    precisionFind({ account })
      .then(res => {
        if (res && res.dataValues.id) {
          resp.send({ code: 400, msg: "用户存在，换一个account名" });
          return;
        }
        create({ username, password, account, id: null, permission: 0 })
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
    verify({ account: decodeURIComponent(account), password })
      .then(({ sc, id, username, intro, avatarSrc, account }) => {
        if (sc) {
          resp
            .cookie('ct_token', jwt.sign({ id }, SECRET!, { expiresIn: '15d' }), {
              maxAge: 15 * DAY,
              path: "/",
              httpOnly: true
            })
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
  getSelfInfo(req: Request, resp: Response) {
    const { id } = req.body;
    precisionFind({ id })
      .then(res => {
        if (!res || res.dataValues.id != id) {
          resp.send(userIsNotExists);
          return;
        }
        const { avatarSrc, biography, username, account, permission } = res.dataValues
        resp.send({ code: 200, msg: "获取个人信息成功", data: { avatarSrc, intro: biography, username, account, id, permission } });
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
    const id = Number(req.query.id)
    const account = String(req.query.account)
    let avatarSrc: string | undefined = void 0;
    req.file && (avatarSrc = `http://localhost:${PORT}/${req.file?.path.replace(staticRoot, '').replace(/\\/g, '/')}`);
    update({ account, id, username, biography: intro, avatarSrc })
      .then(() => resp.send(modifySuc))
      .catch(err => {
        console.error(`修改失败：${err}`);
        resp.send(serviceError);
      })
  }
  getViewerInfo(req: Request, resp: Response) {
    let { id: _id = -1, viewer_id: _vid, page_num } = req.query;
    const id = Number(_id), viewer_id = Number(_vid)
    precisionFind({ id: viewer_id })
      .then(res => {
        if (!res || res.dataValues.id !== viewer_id) {
          resp.send(userIsNotExists);
          return;
        }
        // 访问主页默认tab页是notes
        Promise.all([
          judgeIsFollower({ id, viewer_id }),
          getUserNotesByPage({ userId: viewer_id, page_num: Number(page_num), category: categories.note })
        ]).then(([isFollower, notes]) => {
          Promise.all(notes.map(note => new Promise(resolve => {
            Promise.all([
              getIsLikeOrCollect({ userId: id, noteId: Number(note.dataValues.id), type: 'like' }),
              countLikesOrCollect({ noteId: Number(note.dataValues.id), type: 'like' })
            ]).then(([isLike, likeCnt]) => {
              resolve({
                id: note.dataValues.id, title: note.dataValues.title,
                posterSrc: note.dataValues.mediaList.split(';')[0],
                userId: note.dataValues.userId, avatarSrc: note.dataValues.user.avatarSrc,
                username: note.dataValues.user.username, isVideo: note.dataValues.isVideo,
                isLike: !!isLike.length,
                likeCnt
              })
            })
          }))).then(notes => {
            resp.send({
              code: 200,
              msg: '获取成功',
              data: {
                username: res.dataValues.username,
                intro: res.dataValues.biography,
                avatarSrc: res.dataValues.avatarSrc,
                isFollower,
                notes
              }
            })
          })
        }).catch(err => {
          console.log(`搜索失败：${err}`);
          resp.send(serviceError);
        })

      })
      .catch(err => {
        console.error(`获取用户信息失败：${err}`);
        resp.send(serviceError);
      })
  }
  quit(req: Request, resp: Response) {
    resp.clearCookie('ct_token').send(successObj)
  }
  async search(req: Request, resp: Response) {
    const { page_num, user } = req.query
    const users = await find({ page_num: Number(page_num), user: user as string })
    resp.send({
      code: 200,
      msg: 'success',
      data: {
        users: users.map(user => {
          return {
            userId: user.dataValues.id,
            username: user.dataValues.username,
            avatarSrc: user.dataValues.avatarSrc,
            biography: user.dataValues.biography,
          }
        })
      }
    })
  }
}

export default new UserController()