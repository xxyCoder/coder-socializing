import { serviceError } from "@src/constant/resp.constant";
import CommentsService from "@src/service/comments.service";
import type { Request, Response } from "express";

const { add, getWithPage } = CommentsService

class CommentController {
    emit(req: Request, resp: Response) {
        const { comment: content, noteId, atUsers, targetCommentId } = req.body;
        const { id: userId } = req.query;
        add({ noteId, userId: Number(userId), content, atUsers, targetCommentId })
            .then(() => {
                resp.send({ code: 200, msg: '评论成功' })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError);
            })
    }
    list(req: Request, resp: Response) {
        const { noteId, page_num } = req.query;
        getWithPage({ page_num: Number(page_num), noteId: Number(noteId) })
            .then(res => {
                resp.send({
                    code: 200,
                    msg: '查询成功',
                    data: {
                        comments: res.map(({ dataValues }) => ({
                            id: dataValues.id,
                            content: dataValues.content,
                            atUsers: dataValues.atUsers,
                            targetCommentId: dataValues.targetCommentId,
                            replies: dataValues.replies,
                            createdAt: dataValues.createdAt,
                            user: {
                                id: dataValues.user.id,
                                username: dataValues.user.username,
                                avatarSrc: dataValues.user.avatarSrc
                            }
                        }))
                    }
                })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError)
            })
    }
}

export default new CommentController();
