import type { Request, Response } from "express";
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
import { NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";

const { add: likeOrCollectAdd, remove: likeOrCollectRev, get: getIsLikeOrCollect, count: countLikesOrCollect } = LikesCollectServe;
const { add: noteAdd, getByPage: getNoteWithPage, get: getNoteDetail } = NotesService;
const { precisionFind } = UsersService;
const { addNotify } = NotifyController
const { search: judgeIsFollower } = ConcernsService;
const { PORT } = env;

class NoteController {
    likeOrCollect(req: Request, resp: Response) {
        const userId = Number(req.query.id);
        const { noteId, is_like, type, is_collect, authorId } = req.body;
        const params = { userId, noteId, type };
        ((is_like || is_collect) ? likeOrCollectAdd(params) : likeOrCollectRev(params))
            .then(row => {
                if ((is_like || is_collect) && authorId !== userId) {
                    addNotify({ type: is_like ? NotifyTypeMap.thumb : NotifyTypeMap.collect, state: NotifyStateMap.unread, noteId, userId: authorId })
                        .then(() => {
                            // 如果在线就通知
                            const sse = getSSEConn(authorId)
                            sse && sse.write({ data: { type: 'notify' } })
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
        const { category, title, content, atUserIds = [], is_video } = req.body;
        const mediaList = req.files as Express.Multer.File[];

        noteAdd({
            tag: category, title, content,
            atUserIds: atUserIds.join(';'),
            userId,
            mediaList: mediaList.map(media => `http://localhost:${PORT}/${media.path.replace(staticRoot, '').replace(/\\/g, '/')}`).join(';'),
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
        const { page_num, viewer_id, category, id } = req.query;
        getNoteWithPage({ userId: Number(viewer_id), page_num: Number(page_num), category: String(category) as categories })
            .then(notes => {
                Promise.all(notes.map(note => new Promise(resolve => {
                    const user = note.dataValues.user.dataValues;
                    Promise.all([
                        getIsLikeOrCollect({ userId: Number(id), noteId: Number(note.dataValues.id), type: 'like' }),
                        countLikesOrCollect({ noteId: Number(note.dataValues.id), type: 'like' })
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
                    getIsLikeOrCollect({ userId: note.dataValues.userId, noteId: Number(noteId), type: 'like' }),
                    countLikesOrCollect({ noteId: Number(noteId), type: 'like' }),
                    getIsLikeOrCollect({ userId: note.dataValues.userId, noteId: Number(noteId), type: 'collect' }),
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
        const { page_num, category, id } = req.query;

        getNoteWithPage({ page_num: Number(page_num), category: String(category) as categories })
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
}

export default new NoteController()