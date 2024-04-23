import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Notifies, { NotifyModel } from "@src/model/notify.model";
import Users from "@src/model/users.model";
import { Op } from "sequelize";

class NotifyService {
  async add({ type, userId, replyCommentId, commentId, noteId, state }: Partial<NotifyModel>) {
    return Notifies.create({ type, userId, replyCommentId, commentId, noteId, state })
  }
  list({ type, userId, page_num }: { type: number[], userId: number } & pageType) {
    return Notifies.findAll({
      where: { type: { [Op.in]: type }, userId },
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: pageSize * page_num,
      include: [Users]
    })
  }
  modify({ id, state }: Partial<NotifyModel>) {
    const updateOp = {}, whereOp = {}
    state && Object.assign(updateOp, { state })
    id && Object.assign(whereOp, { id })
    return Notifies.update(updateOp, { where: whereOp })
  }
  find({ type, userId, noteId }: Partial<NotifyModel>) {
    return Notifies.findOne({
      where: { type, userId, noteId }
    })
  }
}

export default new NotifyService()