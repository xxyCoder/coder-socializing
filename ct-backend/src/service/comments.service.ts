import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Comments, { CommentModel } from "@src/model/comments.model";
import Users from "@src/model/users.model";

class CommentService {
    getWithPage({ page_num, noteId }: pageType & { noteId: number }) {
        return Comments.findAll({
            where: { noteId },
            offset: page_num * pageSize,
            limit: pageSize,
            order: [['replies', 'DESC']],
            include: [Users]
        })
    }
    add({ noteId, userId, content, atUsers = '', targetCommentId }: Partial<CommentModel>) {
        return Comments.create({ noteId, userId, content, atUsers, targetCommentId, replies: 0 })
    }
}

export default new CommentService();
