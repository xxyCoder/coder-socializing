import { pageSize } from "@src/constant/resp.constant";
import { pageType } from "@src/constant/types";
import Notifies, { NotifyModel } from "@src/model/notify.model";
import Users from "@src/model/users.model";
import { Op } from "sequelize";

class NotifyService {
  async add({ type, userId, replyCommentId, commentId, noteId, state, receiverId }: Partial<NotifyModel>) {
    return Notifies.create({ type, userId, replyCommentId, commentId, noteId, state, receiverId })
  }
  list({ type, receiverId, page_num }: { type: number[], receiverId: number } & pageType) {
    return Notifies.findAll({
      where: { type: { [Op.in]: type }, receiverId },
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: pageSize * page_num,
      include: [Users]
    })
  }
  modify({ id, state, receiverId, type }: Omit<Partial<NotifyModel>, 'type'> & { type?: number[] }) {
    const updateOp = {}, whereOp = {}
    state && Object.assign(updateOp, { state })
    id && Object.assign(whereOp, { id })
    receiverId && Object.assign(whereOp, { receiverId })
    type && Object.assign(whereOp, { type: { [Op.in]: type } })
    return Notifies.update(updateOp, { where: whereOp })
  }
  find({ type, userId, noteId }: Partial<NotifyModel>) {
    return Notifies.findOne({
      where: { type, userId, noteId }
    })
  }
  countBytype({ type, receiverId, state }: { type: number[], receiverId: number, state: number }) {
    return Notifies.count({
      where: { type: { [Op.in]: type }, receiverId, state }
    })
  }
}

export default new NotifyService()