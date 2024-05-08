import type { Request, Response } from "express";
import fs from 'fs'
import LikesCollectServe from "@src/service/likes-collect.serve";
import { serviceError, successObj } from "@src/constant/resp.constant";
import NotesService from "@src/service/notes.service";
import ConcernsService from "@src/service/concerns.service";
import UsersService from "@src/service/users.service";
import NotifyController from '@src/controller/notify.controller'
import { staticRoot } from "@src/app";
import env from "@src/config/default.config";
import { NoteCardType, categories } from "@src/constant/types";
import { getSSEConn } from "@src/router/sse.router";
import { InteractionTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import path from "path";

const { add: likeOrCollectAdd, remove: likeOrCollectRev, get: getIsLikeOrCollect, count: countLikesOrCollect } = LikesCollectServe;
const { add: noteAdd, getByPage: getNoteWithPage, get: getNoteDetail, countAll: getNoteTotalSize, remove: removeNoteById, update: updateNoteById } = NotesService;
const { precisionFind } = UsersService;
const { addNotify } = NotifyController
const { search: judgeIsFollower } = ConcernsService;
const { PORT } = env;

const root_path = `http://localhost:${PORT}`

class NoteController {
  likeOrCollect(req: Request, resp: Response) {
    const userId = Number(req.query.id);
    const { noteId, is_like, type, is_collect, authorId } = req.body;
    const params = { userId, noteId, type };
    ((is_like || is_collect) ? likeOrCollectAdd(params) : likeOrCollectRev(params))
      .then(row => {
        if ((is_like || is_collect) && authorId !== userId) {
          addNotify({ type: is_like ? NotifyTypeMap.thumb : NotifyTypeMap.collect, state: NotifyStateMap.unread, noteId, userId, receiverId: authorId })
            .then((res) => {
              // 如果在线就通知
              if (res) {
                const sse = getSSEConn(authorId)
                sse && sse.write({ data: { type: InteractionTypeMap["like-collect"] } })
              }
            })
            .catch(err => {
              console.error(`${authorId}通知失败:${err}`)
            })
        }
        const ret = row ? successObj : { code: 400, msg: '不存在' }
        resp.send(ret);
      })
      .catch(err => {
        console.error(`操作笔记错误：${err}`);
        resp.send({ code: 400, msg: '操作失败' });
      })
  }
  publish(req: Request, resp: Response) {
    const userId = Number(req.query.id);
    const { category, title, content, is_video } = req.body;
    const mediaList = req.files as Express.Multer.File[];

    noteAdd({
      tag: category, title, content,
      userId,
      mediaList: mediaList.map(media => `${root_path}/${media.path.replace(staticRoot, '').replace(/\\/g, '/')}`).join(';'),
      isVideo: JSON.parse(is_video)
    })
      .then(() => {
        resp.send(successObj)
      })
      .catch(err => {
        console.error(`发布错误：${err}`);
        resp.send(serviceError)
      })
  }
  getWithPage(req: Request, resp: Response) {
    const { page_num, viewer_id, category, id = -1 } = req.query;
    getNoteWithPage({ userId: Number(viewer_id), page_num: Number(page_num), category: String(category) as categories })
      .then(notes => {
        Promise.all(notes.map(note => new Promise(resolve => {
          const user = note.dataValues.user.dataValues;
          Promise.all([
            getIsLikeOrCollect({ userId: Number(id), noteId: Number(note.dataValues.id), type: categories.like }),
            countLikesOrCollect({ noteId: Number(note.dataValues.id), type: categories.like })
          ]).then(([isLike, likeCnt]) => {
            resolve({
              isLike: !!isLike.length,
              likeCnt,
              id: note.dataValues.id,
              title: note.dataValues.title,
              posterSrc: note.dataValues.mediaList.split(';')[0],
              isVideo: note.dataValues.isVideo,
              userId: user.id,
              username: user.username,
              avatarSrc: user.avatarSrc
            })
          })
        }))).then((infos) => {
          resp.send({ code: 200, msg: '查询成功', data: { notes: infos } });
        })
      })
      .catch(err => {
        console.log(`分页查询笔记失败：${err}`);
        resp.send(serviceError)
      })
  }
  getDetail(req: Request, resp: Response) {
    const { noteId, id = -1 } = req.query;
    getNoteDetail(Number(noteId))
      .then(note => {
        if (!note || !note.dataValues) {
          resp.send({ code: 400, msg: '不存在该笔记' });
          return;
        }
        Promise.all([
          judgeIsFollower({ id: Number(id), viewer_id: note.dataValues.userId }),
          precisionFind({ id: note.dataValues.userId }),
          getIsLikeOrCollect({ userId: Number(id), noteId: Number(noteId), type: 'like' }),
          countLikesOrCollect({ noteId: Number(noteId), type: 'like' }),
          getIsLikeOrCollect({ userId: Number(id), noteId: Number(noteId), type: 'collect' }),
          countLikesOrCollect({ noteId: Number(noteId), type: 'collect' }),
        ])
          .then(([isFollower, user, isLike, likeCnt, isCollect, collectCnt]) => {
            resp.send({
              code: 200,
              msg: '获取成功',
              data: {
                user: {
                  userId: user?.dataValues.id,
                  username: user?.dataValues.username,
                  avatarSrc: user?.dataValues.avatarSrc,
                  isFollower
                },
                note: {
                  atUserList: note.dataValues.atUserIds,
                  content: note.dataValues.content,
                  title: note.dataValues.title,
                  mediaList: note.dataValues.mediaList,
                  tag: note.dataValues.tag,
                  isVideo: note.dataValues.isVideo,
                  updateDate: note.dataValues.updatedAt,
                  createDate: note.dataValues.createdAt,
                  id: note.dataValues.id,
                  isLike: !!isLike.length,
                  likeCnt,
                  isCollect: !!isCollect.length,
                  collectCnt
                }
              }
            })
          })
      })
      .catch(err => {
        console.log(`获取笔记详情失败：${err}`);
        resp.send(serviceError);
      })
  }
  getByTag(req: Request, resp: Response) {
    const { page_num, category, id = -1, question } = req.query;

    getNoteWithPage({ page_num: Number(page_num), category: String(category) as categories, question: question as string })
      .then(res => {
        const notes: NoteCardType[] = [];
        Promise.all(res.map(note => new Promise(resolve => {
          const user = note.dataValues.user.dataValues;
          Promise.all([
            getIsLikeOrCollect({ userId: Number(id), noteId: Number(note.dataValues.id), type: 'like' }),
            countLikesOrCollect({ noteId: Number(note.dataValues.id), type: 'like' })
          ]).then(([isLike, likeCnt]) => {
            const info = {
              id: note.dataValues.id,
              title: note.dataValues.title,
              posterSrc: note.dataValues.mediaList.split(';')[0],
              isVideo: note.dataValues.isVideo,
              isLike: !!isLike.length,
              likeCnt,
              userId: user.id,
              username: user.username,
              avatarSrc: user.avatarSrc
            }
            notes.push(info)
            resolve(info);
          })

        }))).then(() => {
          resp.send({ code: 200, msg: '获取成功', data: { notes } })
        })
      })
      .catch(err => {
        console.error(`首页获取数据失败：${err}`);
        resp.send(serviceError);
      })
  }
  async randomGet(req: Request, resp: Response) {
    const noteIdSet = new Set<number>()
    const total = await getNoteTotalSize()
    let id
    const notes = []
    while (noteIdSet.size < Math.min(5, total)) {
      id = Math.round(Math.random() * total)
      if (!noteIdSet.has(id)) {
        const note = await getNoteDetail(id)
        if (note) {
          noteIdSet.add(id)
          notes.push({ id: note.dataValues.id, title: note.dataValues.title })
        }
      }
    }
    resp.send({
      code: 200,
      msg: 'success',
      data: { notes }
    })
  }
  async deleteNote(req: Request, resp: Response) {
    const { noteId, id } = req.query
    const note = await getNoteDetail(Number(noteId))
    if (!note) {
      resp.send({ code: 400, msg: '该笔记不存在' })
      return
    }
    const mediaList: string[] = note.dataValues.mediaList.split(';')
    mediaList.forEach(p => {
      fs.unlink(path.join(__dirname, p.replace(root_path, '../../')), (err) => {
        if (err) {
          console.error(`图片删除失败：${p}`)
        }
      })
    })
    removeNoteById({ noteId: Number(noteId), userId: Number(id) })
      .then(res => {
        res ? resp.send({ code: 200, msg: '删除成功' }) : resp.send({ code: 400, msg: '删除失败' })
      })
      .catch(err => {
        console.error(`删除失败:${err}`)
        resp.send(serviceError)
      })
  }
  updateNote(req: Request, resp: Response) {
    const userId = Number(req.query.id)
    const { category, title, content, is_video, staticUrls = '', noteId } = req.body;
    const mediaList = req.files as Express.Multer.File[];

    updateNoteById({
      tag: category, title, content, id: noteId,
      mediaList: (staticUrls ? [staticUrls] : []).concat(...mediaList.map(media => `http://localhost:${PORT}/${media.path.replace(staticRoot, '').replace(/\\/g, '/')}`)).join(';'),
      isVideo: JSON.parse(is_video), userId
    })
      .then(([cnt]) => {
        if (cnt) {
          resp.send(successObj)
        } else {
          resp.send({ code: 400, msg: '更新失败' })
        }
      })
      .catch(err => {
        console.error(`更新失败:${err}`)
        resp.send(serviceError)
      })
  }
}

export default new NoteController()