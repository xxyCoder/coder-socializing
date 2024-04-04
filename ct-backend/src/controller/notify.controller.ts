import { InteractionTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import NotifyService from "@src/service/notifies.service";
import NotesService from "@src/service/notes.service";
import CommentsService from "@src/service/comments.service";
import { Request, Response } from "express";
import { Notify } from "@src/constant/types";
import { serviceError, successObj } from "@src/constant/resp.constant";
import { Model } from "sequelize";
import { NotifyModel } from "@src/model/notify.model";

const { list: getNotifyList, modify: modifyNotifyInfo, find, add } = NotifyService
const { get: getNoteInfo } = NotesService;
const { find: getCommentInfo, findAll: getAllComment } = CommentsService;

class NotiftController {
    async list(req: Request, resp: Response) {
        const type = Number(req.query.type), page_num = Number(req.query.page_num)
        const userId = Number(req.query.id)
        let notifies: Model<any, any>[] = [], data: Notify[] = []
        let isGetSelfComment = false
        try {
            switch (type) {
                case InteractionTypeMap["comment-at"]:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.comment, NotifyTypeMap.at], userId, page_num })
                    break
                case InteractionTypeMap["thumb-collet"]:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.thumb, NotifyTypeMap.collect], userId, page_num })
                    break
                case InteractionTypeMap.concern:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.concern], userId, page_num })
                    break
                case InteractionTypeMap["self-comment"]:
                    isGetSelfComment = true
                    notifies = await getAllComment({ userId, page_num })
            }
        } catch (err) {
            console.error(`获取通知失败:${err}`)
            resp.send({ code: 400, msg: '获取失败' })
            return
        }
        for (let i = 0, len = notifies.length; i < len; ++i) {
            const notify = notifies[i];
            const { userId, commentId, noteId, id, content, targetCommentId, rootCommentId } = notify.dataValues
            let replyCommentId = notify.dataValues.replyCommentId
            if (!replyCommentId) replyCommentId = targetCommentId
            const { username, avatarSrc } = notify.dataValues.user
            const [comment1, comment2, noteInfo] = await Promise.all([
                commentId ? getCommentInfo({ id: commentId }) : Promise.resolve(null),
                replyCommentId ? getCommentInfo({ id: replyCommentId }) : Promise.resolve(null),
                noteId ? getNoteInfo(noteId) : Promise.resolve(null)
            ])
            data.push({
                id,
                userId,
                username,
                avatarSrc,
                noteId,
                rootCommentId: isGetSelfComment ? rootCommentId : (comment2?.dataValues.rootCommentId || null),
                commentId: isGetSelfComment ? id : commentId,
                replyCommentId,
                title: noteInfo?.dataValues.title || '',
                content: (isGetSelfComment ? content : comment1?.dataValues.content) || '',
                replyContent: comment2?.dataValues.content || '',
                time: +new Date(notify.dataValues.createdAt),
                status: isGetSelfComment ? NotifyStateMap.read : notify.dataValues.state,
                type: isGetSelfComment ? NotifyTypeMap["self-comment"] : notify.dataValues.type,
            })
        }
        resp.send({ code: 200, msg: '获取成功', data })
    }
    changeStatus(req: Request, resp: Response) {
        const { notifyId } = req.body
        modifyNotifyInfo({ id: +notifyId, state: NotifyStateMap.read })
            .then(() => {
                resp.send(successObj)
            })
            .catch(err => {
                console.error(`修改状态失败：${err}`);
                resp.send(serviceError)
            })
    }
    async addNotify({ type, userId, replyCommentId, commentId, noteId, state }: Partial<NotifyModel>) {
        const notify = type === NotifyTypeMap.comment ? null : await find({ type, userId, noteId })
        if (notify?.dataValues) return Promise.reject(new Error('通知过了'))
        return add({ type, userId, replyCommentId, commentId, noteId, state })
    }
}

export default new NotiftController()
