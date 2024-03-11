import { FrontNotifyTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import NotifiesService from "@src/service/notifies.service";
import NotesService from "@src/service/notes.service";
import CommentsService from "@src/service/comments.service";
import { Request, Response } from "express";
import { Notify } from "@src/constant/types";

const { list: getNotifyList } = NotifiesService
const { get: getNoteInfo } = NotesService;
const { find: getCommentInfo } = CommentsService;

class NotiftController {
    async list(req: Request, resp: Response) {
        const { type } = req.query
        let notifies, data: Notify[] = []

        try {
            switch (type) {
                case FrontNotifyTypeMap["comment-at"]:
                    notifies = await getNotifyList({ type: [NotifyTypeMap.comment, NotifyTypeMap.at] })
                    for (let i = 0, len = notifies.length; i < len; ++i) {
                        const notify = notifies[i];
                        const { userId, commentId, replyCommentId, noteId, id } = notify.dataValues
                        const { username, avatarSrc } = notify.dataValues.user
                        const [comment1, comment2, noteInfo] = await Promise.all([
                            getCommentInfo({ id: commentId }),
                            getCommentInfo({ id: replyCommentId }),
                            getNoteInfo(notify.dataValues.noteId)
                        ])
                        data.push({
                            id,
                            userId,
                            username,
                            avatarSrc,
                            noteId,
                            commentId,
                            replyCommentId,
                            title: noteInfo?.dataValues.title,
                            content: comment1?.dataValues.content,
                            replyContent: comment2?.dataValues.content,
                            time: +new Date(notify.dataValues.createdAt),
                            status: NotifyStateMap.unread,
                            tinyType: notify.dataValues.type,
                            type: FrontNotifyTypeMap["comment-at"]
                        })
                    }
                    break
            }
        } catch (err) {
            console.log(`获取通知失败:${err}`)
        }
        resp.send({ code: 200, msg: '获取成功', data })
    }
}

export default new NotiftController()
