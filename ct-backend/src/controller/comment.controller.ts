import { pageSize, serviceError } from "@src/constant/resp.constant";
import { CommentInfo } from "@src/constant/types";
import CommentsService from "@src/service/comments.service";
import type { Request, Response } from "express";

const { add, getWithPage, count } = CommentsService

class CommentController {
    emit(req: Request, resp: Response) {
        const { comment: content, noteId, atUsers, targetCommentId } = req.body;
        const { id: userId } = req.query;
        add({ noteId, userId: Number(userId), content, atUsers, targetCommentId })
            .then(res => {
                resp.send({ code: 200, msg: '评论成功', data: res })
            })
            .catch(err => {
                console.error(`发布评论失败：${err}`)
                resp.send(serviceError);
            })
    }
    list(req: Request, resp: Response) {
        const { noteId, page_num, targetCommentId } = req.query;
        const tcd = Number(targetCommentId)

        getWithPage({ page_num: Number(page_num), noteId: Number(noteId), targetCommentId: Number.isNaN(tcd) ? null : tcd }) // 找“根”评论
            .then(res => {
                Promise.all(res.map(({ dataValues: dv }) => new Promise(async resolve => {
                    const replyCnt = await (!Number.isNaN(tcd) ? 0 : count({ noteId: Number(noteId), targetCommentId: dv.id }));
                    getWithPage({ page_num: Number(page_num), noteId: Number(noteId), targetCommentId: dv.id }) // 找子级评论
                        .then((res2) => {
                            const childs: CommentInfo[] = [];
                            res2.forEach(({ dataValues: dv2 }) => {
                                childs.push({
                                    id: dv2.id,
                                    content: dv2.content,
                                    atUsers: dv2.atUsers,
                                    targetCommentId: dv2.targetCommentId,
                                    createdAt: dv2.createdAt,
                                    replyCnt: replyCnt - Number(page_num) * pageSize,
                                    user: {
                                        id: dv2.user.id,
                                        username: dv2.user.username,
                                        avatarSrc: dv2.user.avatarSrc
                                    },
                                    childs: []
                                })
                            })
                            resolve({
                                id: dv.id,
                                content: dv.content,
                                atUsers: dv.atUsers,
                                targetCommentId: dv.targetCommentId,
                                createdAt: dv.createdAt,
                                user: {
                                    id: dv.user.id,
                                    username: dv.user.username,
                                    avatarSrc: dv.user.avatarSrc
                                },
                                childs
                            })
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
