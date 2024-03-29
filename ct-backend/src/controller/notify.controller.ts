import { FrontNotifyTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import NotifiesService from "@src/service/notifies.service";
import NotesService from "@src/service/notes.service";
import CommentsService from "@src/service/comments.service";
import { Request, Response } from "express";
import { Notify } from "@src/constant/types";
import { serviceError, successObj } from "@src/constant/resp.constant";
import { Model } from "sequelize";

const { list: getNotifyList, modify: modifyNotifyInfo } = NotifiesService
const { get: getNoteInfo } = NotesService;
const { find: getCommentInfo } = CommentsService;

class NotiftController {
    async list(req: Request, resp: Response) {
        const type = Number(req.query.type)
        const userId = Number(req.query.id)
        let notifies: Model<any, any>[] = [], data: Notify[] = []

        try {
            switch (type) {
                case FrontNotifyTypeMap["comment-at"]:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.comment, NotifyTypeMap.at], userId })
                    break
                case FrontNotifyTypeMap["thumb-collet"]:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.thumb, NotifyTypeMap.collect], userId })
                    break
                case FrontNotifyTypeMap.concern:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.concern], userId })
                    break
            }
        } catch (err) {
            console.error(`获取通知失败:${err}`)
            resp.send({ code: 400, msg: '获取失败' })
            return
        }
        for (let i = 0, len = notifies.length; i < len; ++i) {
            const notify = notifies[i];
            const { userId, commentId, replyCommentId, noteId, id } = notify.dataValues
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
                rootCommentId: comment2?.dataValues.rootCommentId || null,
                commentId,
                replyCommentId,
                title: noteInfo?.dataValues.title || '',
                content: comment1?.dataValues.content || '',
                replyContent: comment2?.dataValues.content || '',
                time: +new Date(notify.dataValues.createdAt),
                status: notify.dataValues.state,
                type: notify.dataValues.type,
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
}

export default new NotiftController()
