import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Comments, { CommentModel } from "@src/model/comments.model";
import Users from "@src/model/users.model";

class CommentService {
    getWithPage({ page_num, noteId, rootCommentId }: pageType & { noteId: number, rootCommentId: number | null }) {
        return Comments.findAll({
            where: { noteId, rootCommentId },
            offset: page_num * pageSize,
            limit: pageSize,
            include: [Users]
        })
    }
    add({ noteId, userId, content, atUsers = '', targetCommentId, rootCommentId }: Partial<CommentModel>) {
        return Comments.create({ noteId, userId, content, atUsers, targetCommentId, rootCommentId })
    }
    count({ noteId, rootCommentId }: { noteId: number, rootCommentId: number }) {
        return Comments.count({
            where: { noteId, rootCommentId }
        });
    }
    findUser(targetCommentId: number) {
        return Comments.findOne({
            where: { id: targetCommentId },
            include: [Users]
        })
    }
    find({ targetCommentId, userId, id }: Partial<CommentModel>) {
        const whereOp = {};
        targetCommentId && Object.assign(whereOp, { targetCommentId })
        userId && Object.assign(whereOp, { userId })
        id && Object.assign(whereOp, { id })

        return Comments.findOne({
            where: whereOp
        })
    }
}

export default new CommentService();
