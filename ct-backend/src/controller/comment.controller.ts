import { serviceError } from "@src/constant/resp.constant";
import { getSSEConn } from "@src/router/sse.router";
import CommentsService from "@src/service/comments.service";
import UsersService from "@src/service/users.service";
import NotesService from "@src/service/notes.service";
import NotifyService from '@src/service/notifies.service'
import type { Request, Response } from "express";
import { NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";

const { add, getWithPage, count, findUser, find } = CommentsService
const { precisionFind } = UsersService
const { get: getNoteInfo } = NotesService
const { add: addNotify } = NotifyService

class CommentController {
    emit(req: Request, resp: Response) {
        const { comment: content, noteId, atUsers, targetCommentId = null, rootCommentId = null, replyUserId } = req.body;
        const { id } = req.query;
        const userId = Number(id)
        add({ noteId, userId, content, atUsers, targetCommentId, rootCommentId })
            .then(res => {
                // 存储起来
                addNotify({ type: NotifyTypeMap.comment, state: NotifyStateMap.unread, commentId: res.dataValues.id, replyCommentId: targetCommentId, noteId, userId })
                    .then(async () => {
                        // 如果在线就通知
                        const sse = getSSEConn(String(replyUserId))
                        if (sse) {
                            const user = await precisionFind({ id: userId })
                            const comment = await find({ targetCommentId })
                            const note = await getNoteInfo(noteId)
                            user && comment && sse.write({
                                data: {
                                    userId,
                                    username: user.dataValues.username,
                                    avatarSrc: user.dataValues.avatarSrc,
                                    noteId,
                                    title: note?.dataValues.title,
                                    commentId: res.dataValues.id,
                                    replyCommentId: targetCommentId,
                                    content: comment.dataValues.content,
                                    replyContent: content,
                                    type: 'comment',
                                    state: NotifyStateMap.unread
                                }
                            })
                        }
                    })
                    .catch(err => {
                        console.error(`${userId}通知失败:${err}`)
                    })

                resp.send({ code: 200, msg: '评论成功', data: res })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError);
            })
    }
    list(req: Request, resp: Response) {
        const { noteId, page_num, rootCommentId } = req.query;
        const rcd = Number(rootCommentId), isNaN = Number.isNaN(rcd), pageNum = Number(page_num);

        getWithPage({ page_num: pageNum, noteId: Number(noteId), rootCommentId: isNaN ? null : rcd })
            .then(res => {
                Promise.all(res.map(({ dataValues: dv }) => new Promise(async resolve => {
                    // 如果rootCommentid为nulll则需要计算剩余多少子评论
                    const replyCnt = await (!isNaN ? 0 : count({ noteId: Number(noteId), rootCommentId: dv.id }));
                    const targetCommentId = dv.targetCommentId, rootCommentId = dv.rootCommentId
                    const replyUsername = (targetCommentId && targetCommentId !== rootCommentId ? (await findUser(targetCommentId))?.dataValues.user.username : '')
                    resolve({
                        id: dv.id,
                        content: dv.content,
                        atUsers: dv.atUsers,
                        targetCommentId,
                        rootCommentId,
                        replyUsername,
                        createdAt: dv.createdAt,
                        replyCnt,
                        user: {
                            userId: dv.user.id,
                            username: dv.user.username,
                            avatarSrc: dv.user.avatarSrc
                        }
                    })
                }))).then(comments => {
                    resp.send({
                        code: 200,
                        msg: '查询成功',
                        data: { comments }
                    })
                })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError)
            })
    }
}

export default new CommentController();
