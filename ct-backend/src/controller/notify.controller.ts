import { InteractionTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import NotifyService from "@src/service/notifies.service";
import NotesService from "@src/service/notes.service";
import CommentsService from "@src/service/comments.service";
import ChatService from "@src/service/chat.service";
import { Request, Response } from "express";
import { Notify } from "@src/constant/types";
import { serviceError, successObj } from "@src/constant/resp.constant";
import { Model } from "sequelize";
import { NotifyModel } from "@src/model/notify.model";

const { list: getNotifyList, modify: modifyNotifyInfo, add, countBytype, find: getNotifyInto } = NotifyService
const { get: getNoteInfo } = NotesService;
const { find: getCommentInfo, findAll: getAllComment } = CommentsService;
const { countUnread: countChatUnread } = ChatService

class NotiftController {
  async list(req: Request, resp: Response) {
    const tag = req.query.tag, page_num = Number(req.query.page_num)
    const userId = Number(req.query.id)
    let notifies: Model<any, any>[] = [], data: Notify[] = []
    let isGetSelfComment = false
    try {
      switch (tag) {
        case InteractionTypeMap["comment-follow"]:
          notifies = await getNotifyList({ type: [NotifyTypeMap.comment, NotifyTypeMap.concern], receiverId: userId, page_num })
          break
        case InteractionTypeMap["like-collect"]:
          notifies = await getNotifyList({ type: [NotifyTypeMap.thumb, NotifyTypeMap.collect], receiverId: userId, page_num })
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
      let _content = content, isDel = false
      if (!isGetSelfComment) {
        if (comment1?.dataValues.deletedAt) {
          isDel = true
          _content = '该评论已删除'
        } else {
          _content = comment1?.dataValues.content
        }
      }

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
        content: _content,
        replyContent: comment2?.dataValues.content || '',
        time: +new Date(notify.dataValues.createdAt),
        status: isGetSelfComment ? NotifyStateMap.read : notify.dataValues.state,
        type: isGetSelfComment ? NotifyTypeMap["self-comment"] : notify.dataValues.type,
        isDel
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
  async addNotify({ type, userId, replyCommentId, commentId, noteId, state, receiverId }: Partial<NotifyModel>) {
    if (type !== NotifyTypeMap.comment) {
      const notify = await getNotifyInto({ type: Number(type), receiverId: Number(receiverId), noteId })
      if (notify) {
        return Promise.resolve(0)
      }
    }
    return add({ type, userId, replyCommentId, commentId, noteId, state, receiverId })
  }
  async getNotifyCnt(req: Request, resp: Response) {
    const receiverId = Number(req.query.id)
    const [commentAndFollowCnt, likeAndCollectCnt, chatCnt] = await Promise.all([
      countBytype({ type: [NotifyTypeMap.comment, NotifyTypeMap.concern], receiverId, state: NotifyStateMap.unread }),
      countBytype({ type: [NotifyTypeMap.thumb, NotifyTypeMap.collect], receiverId, state: NotifyStateMap.unread }),
      countChatUnread({ receiverId })
    ])

    resp.send({
      code: 200,
      msg: '获取成功',
      data: {
        commentAndFollowCnt,
        likeAndCollectCnt,
        chatCnt
      }
    })
  }
  async clearNotify(req: Request, resp: Response) {
    const receiverId = Number(req.query.id), tag = String(req.query.tag)
    try {
      switch (tag) {
        case InteractionTypeMap["comment-follow"]:
          await modifyNotifyInfo({ type: [NotifyTypeMap.comment, NotifyTypeMap.concern], receiverId, state: NotifyStateMap.read })
          break
        case InteractionTypeMap["like-collect"]:
          await modifyNotifyInfo({ type: [NotifyTypeMap.thumb, NotifyTypeMap.collect], receiverId, state: NotifyStateMap.read })
          break
      }
      resp.send(successObj)
    } catch (err) {
      console.error(`清除失败：${err}`)
      resp.send(serviceError)
    }
  }
}

export default new NotiftController()
