import type { Request, Response } from "express";
import LikesCollectServe from "@src/service/likes-collect.serve";
import { pageSize, serviceError, successObj } from "@src/constant/resp.constant";
import NotesService from "@src/service/notes.service";
import ConcernsService from "@src/service/concerns.service";
import UsersService from "@src/service/users.service";
import CommentsService from "@src/service/comments.service";
import { staticRoot } from "@src/app";
import env from "@src/config/default.config";
import { NoteCardType } from "@src/constant/types";

const { add: likeOrCollectAdd, remove: likeOrCollectRev, get: getIsLikeOrCollect, count: countLikesOrCollect } = LikesCollectServe;
const { add: noteAdd, getByPage: getNoteWithPage, get: getNoteDetail } = NotesService;
const { precisionFind } = UsersService;
const { search: judgeIsFollower } = ConcernsService;
const { getNoteCommentWithPage } = CommentsService;
const { PORT } = env;

class NoteController {
    likeOrCollect(req: Request, resp: Response) {
        const userId = req.query.id as string;
        const { noteId, is_like, type, is_collect } = req.body;
        const params = { userId: Number(userId), noteId: Number(noteId), type };
        ((is_like === 'true' || is_collect === 'true') ? likeOrCollectAdd(params) : likeOrCollectRev(params))
            .then(row => {
                const ret = row ? successObj : { code: 400, msg: '不存在' }
                resp.send(ret);
            })
            .catch(err => {
                console.error(`操作笔记错误：${err}`);
                resp.send({ code: 400, msg: '操作失败' });
            })
    }
    publish(req: Request, resp: Response) {
        const userId = req.query.id as string;
        const { category, title, content, atUserIds = [], is_video } = req.body;
        const mediaList = req.files as Express.Multer.File[];

        noteAdd({
            tag: category, title, content,
            atUserIds: atUserIds.join(';'),
            userId: Number(userId),
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
        const { page_num, viewer_id, category } = req.query;
        getNoteWithPage({ userId: Number(viewer_id), page_num: Number(page_num), category: String(category) })
            .then(res => {
                resp.send({ code: 200, msg: '查询成功', data: { notes: res } });
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
        const { page_num, category } = req.query;
        getNoteWithPage({ page_num: Number(page_num), category: String(category) })
            .then(res => {
                const notes: NoteCardType[] = [];
                res.forEach(note => {
                    const user = note.dataValues.user.dataValues;
                    notes.push({
                        id: note.dataValues.id,
                        title: note.dataValues.title,
                        posterSrc: note.dataValues.mediaList.split(';')[0],
                        isVideo: note.dataValues.isVideo,
                        userId: user.id,
                        username: user.username,
                        avatarSrc: user.avatarSrc
                    })
                })
                resp.send({ code: 200, msg: '获取成功', data: { notes } })
            })
            .catch(err => {
                console.error(`首页获取数据失败：${err}`);
                resp.send(serviceError);
            })
    }
}

export default new NoteController()