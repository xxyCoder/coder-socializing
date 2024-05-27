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
  add({ noteId, userId, content, targetCommentId, rootCommentId }: Partial<CommentModel>) {
    return Comments.create({ noteId, userId, content, targetCommentId, rootCommentId })
  }
  count({ rootCommentId }: { rootCommentId: number }) {
    return Comments.count({
      where: { rootCommentId }
    });
  }
  findUser(id: number) {
    return Comments.findOne({
      where: { id },
      paranoid: false,
      include: [Users]
    })
  }
  find({ targetCommentId, userId, id }: Partial<CommentModel>) {
    const whereOp = {};
    targetCommentId && Object.assign(whereOp, { targetCommentId })
    userId && Object.assign(whereOp, { userId })
    if (id || id === null) Object.assign(whereOp, { id })

    return Comments.findOne({
      where: whereOp
    })
  }
  findAll({ userId, page_num }: Partial<CommentModel> & pageType) {
    const whereOp = {}
    userId && Object.assign(whereOp, { userId })

    return Comments.findAll({
      where: whereOp,
      order: [['createdAt', 'DESC']],
      offset: page_num * pageSize,
      limit: pageSize,
      include: [Users]
    })
  }
  remove({ rootCommentId, commentId, noteId, userId, permission = 0 }: { rootCommentId?: number, commentId?: number, noteId: number, userId?: number, permission?: number }) {
    const whereOp = { noteId }
    rootCommentId && Object.assign(whereOp, { rootCommentId })
    commentId && Object.assign(whereOp, { id: commentId })
    !permission && userId && Object.assign(whereOp, { userId })

    return Comments.destroy({ where: whereOp })
  }
}

export default new CommentService();
