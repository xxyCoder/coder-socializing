import { pageSize, serviceError } from "@src/constant/resp.constant";
import CommentsService from "@src/service/comments.service";
import type { Request, Response } from "express";

const { add, getWithPage, count } = CommentsService

class CommentController {
    emit(req: Request, resp: Response) {
        const { comment: content, noteId, atUsers, targetCommentId = null, rootCommentId = null } = req.body;
        const { id: userId } = req.query;
        add({ noteId, userId: Number(userId), content, atUsers, targetCommentId, rootCommentId })
            .then(res => {
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
                    resolve({
                        id: dv.id,
                        content: dv.content,
                        atUsers: dv.atUsers,
                        targetCommentId: dv.targetCommentId,
                        rootCommentId: dv.rootCommentId,
                        // replyUsername: dv.targetCommentId !== dv.rootCommentId ? dv. : '',
                        createdAt: dv.createdAt,
                        replyCnt,
                        user: {
                            id: dv.user.id,
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
