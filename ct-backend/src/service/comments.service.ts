import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Comments, { CommentModel } from "@src/model/comments.model";
import Users from "@src/model/users.model";

class CommentService {
    getWithPage({ page_num, noteId, targetCommentId }: pageType & { noteId: number, targetCommentId: number | null }) {
        return Comments.findAll({
            where: { noteId, targetCommentId },
            offset: page_num * pageSize,
            limit: pageSize,
            include: [Users]
        })
    }
    add({ noteId, userId, content, atUsers = '', targetCommentId }: Partial<CommentModel>) {
        return Comments.create({ noteId, userId, content, atUsers, targetCommentId })
    }
    count({ noteId, targetCommentId }: { noteId: number, targetCommentId: number }) {
        return Comments.count({
            where: { noteId, targetCommentId }
        });
    }
}

export default new CommentService();
