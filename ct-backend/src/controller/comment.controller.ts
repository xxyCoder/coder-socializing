import { serviceError } from "@src/constant/resp.constant";
import CommentsService from "@src/service/comments.service";
import type { Request, Response } from "express";

const { add } = CommentsService

class CommentController {
    emit(req: Request, resp: Response) {
        const { comment: content, noteId, atUsers, targetCommentId } = req.body;
        const { userId } = req.query;
        add({ noteId, userId: Number(userId), content, atUsers, targetCommentId })
            .then(() => {
                resp.send({ code: 200, msg: '评论成功' })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError);
            })
    }
}

export default new CommentController();
