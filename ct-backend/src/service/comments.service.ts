import { pageType } from "@src/constant/types";
import Comments from "@src/model/comments.model";

class CommentService {
    getNoteCommentWithPage({ page_num, page_size, noteId }: pageType & { noteId: number }) {
        return Comments.findAll({
            where: { noteId },
            offset: page_num * page_size,
            limit: page_size,
            order: [['like', 'DESC']]
        })
    }
}

export default new CommentService();
