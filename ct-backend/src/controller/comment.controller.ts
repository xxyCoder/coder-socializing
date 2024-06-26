import { serviceError, successObj } from "@src/constant/resp.constant";
import { getSSEConn } from "@src/router/sse.router";
import CommentsService from "@src/service/comments.service";
import NotifyController from '@src/controller/notify.controller'
import NotesService from "@src/service/notes.service";
import type { Request, Response } from "express";
import { InteractionTypeMap, NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import UsersService from "@src/service/users.service";

const { add, getWithPage, count, findUser, find, remove } = CommentsService
const { addNotify, } = NotifyController
const { get: getAuthorInfo } = NotesService
const { precisionFind } = UsersService

class CommentController {
  emit(req: Request, resp: Response) {
    const { comment: content, noteId, targetCommentId = null, rootCommentId = null, replyUserId } = req.body;
    const userId = Number(req.query.id)
    add({ noteId, userId, content, targetCommentId, rootCommentId })
      .then(res => {
        // 自己的操作不必通知自己
        if (replyUserId !== userId) {
          // 存储起来
          addNotify({ type: NotifyTypeMap.comment, state: NotifyStateMap.unread, commentId: res.dataValues.id, replyCommentId: targetCommentId, noteId, userId, receiverId: replyUserId })
            .then(() => {
              // 如果在线就通知
              const sse = getSSEConn(replyUserId)
              sse && sse.write({ data: { type: InteractionTypeMap["comment-follow"] } })
            })
            .catch(err => {
              console.error(`${userId}通知失败:${err}`)
            })
        }
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
          const replyCnt = await (!isNaN ? 0 : count({ rootCommentId: dv.id }));
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
  notifyList(req: Request, resp: Response) {
    const commentId = Number(req.query.commentId)
    Promise.all([find({ id: commentId }), findUser(commentId)])
      .then(async ([comment, user]) => {
        const replyCommentId = comment?.dataValues.targetCommentId, rootCommentId = comment?.dataValues.rootCommentId
        let [replyComment, rootComment] = await Promise.all([
          find({ id: replyCommentId }),
          rootCommentId !== replyCommentId ? find({ id: rootCommentId }) : Promise.resolve(null)
        ])
        let [replyUser, targetUser, rootUser, replyCnt] = await Promise.all([
          findUser(replyCommentId),
          findUser(replyComment?.dataValues.targetCommentId || null),
          rootCommentId !== replyCommentId ? findUser(rootCommentId) : Promise.resolve(null),
          count({ rootCommentId: rootComment?.dataValues.id || replyCommentId || commentId })
        ])
        if (!rootComment) {
          if (replyComment) {
            rootComment = replyComment, replyComment = comment, comment = null
            rootUser = replyUser, replyUser = user, user = null
          } else {
            rootComment = comment, comment = null
            rootUser = user, user = null
          }
        }
        if (!replyComment) {
          replyComment = comment, comment = null
          replyUser = user, user = null
        }
        console.log(rootUser?.dataValues.user, '<-root', replyUser?.dataValues.user, '<-reply', targetUser?.dataValues.user, '<-user')
        resp.send({
          code: 200,
          msg: '获取成功',
          data: {
            comments: [{
              id: rootComment?.dataValues.id,
              content: rootComment?.dataValues.content || '该评论已删除',
              atUsers: rootComment?.dataValues.atUsers,
              targetCommentId: null,
              rootCommentId: null,
              replyUsername: '',
              createdAt: rootComment?.dataValues.createdAt,
              replyCnt,
              user: {
                userId: rootUser?.dataValues.user.dataValues.id,
                username: rootUser?.dataValues.user.dataValues.username,
                avatarSrc: rootUser?.dataValues.user.dataValues.avatarSrc
              }
            }, {
              id: replyComment?.dataValues.id,
              content: replyComment?.dataValues.content,
              atUsers: replyComment?.dataValues.atUsers,
              targetCommentId: replyComment?.dataValues.targetCommentId,
              rootCommentId: replyComment?.dataValues.rootCommentId,
              replyUsername: targetUser?.dataValues.user.username,
              createdAt: rootComment?.dataValues.createdAt,
              user: {
                userId: replyUser?.dataValues.user.dataValues.id,
                username: replyUser?.dataValues.user.dataValues.username,
                avatarSrc: replyUser?.dataValues.user.dataValues.avatarSrc
              }
            }, {
              id: comment?.dataValues.id,
              content: comment?.dataValues.content,
              atUsers: comment?.dataValues.atUsers,
              targetCommentId: comment?.dataValues.targetCommentId,
              rootCommentId: comment?.dataValues.rootCommentId,
              replyUsername: replyUser?.dataValues.user.dataValues.username,
              createdAt: comment?.dataValues.createdAt,
              user: {
                userId: user?.dataValues.user.dataValues.id,
                username: user?.dataValues.user.dataValues.username,
                avatarSrc: user?.dataValues.user.dataValues.avatarSrc
              }
            }]
          }
        })
      })
      .catch(err => {
        console.error(`获取通知评论失败：${err}`)
        resp.send({ code: 400, msg: '获取失败' })
      })
  }
  async removeComment(req: Request, resp: Response) {
    const noteId = Number(req.query.noteId), commentId = Number(req.query.commentId), id = Number(req.query.id)
    const author = await getAuthorInfo(noteId)
    if (author?.dataValues.userId === id) { // 如果是作者
      const [c1, c2] = await Promise.all([remove({ noteId, commentId }), remove({ noteId, rootCommentId: commentId })])
      if (c1 || c2) {
        resp.send(successObj)
      } else {
        resp.send({ code: 400, msg: '该评论不存在' })
      }
    } else {
      const user = await precisionFind({ id })
      const effect_cnt = await remove({ noteId, commentId, userId: id, permission: user?.dataValues.permission })
      if (!effect_cnt) {
        resp.send({ code: 400, msg: '非本人删除' })
        return
      }
      remove({ noteId, rootCommentId: commentId })
      resp.send(successObj)
    }
  }
}

export default new CommentController();
