import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Comments from "@src/model/comments.model";

class CommentService {
    getNoteCommentWithPage({ page_num, noteId }: pageType & { noteId: number }) {
        return Comments.findAll({
            where: { noteId },
            offset: page_num * pageSize,
            limit: pageSize,
            order: [['like', 'DESC']]
        })
    }
}

export default new CommentService();
