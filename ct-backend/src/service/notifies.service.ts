import Notifies, { NotifyModel } from "@src/model/notify.model";
import Users from "@src/model/users.model";
import { Op } from "sequelize";

class NotifyService {
    add({ type, userId, replyCommentId, commentId, noteId, state }: Partial<NotifyModel>) {
        return Notifies.create({ type, userId, replyCommentId, commentId, noteId, state })
    }
    list({ type, userId }: { type: number[], userId: number }) {
        return Notifies.findAll({
            where: { type: { [Op.in]: type }, userId },
            order: [['createdAt', 'DESC']],
            include: [Users]
        })
    }
    modify({ id, state }: Partial<NotifyModel>) {
        const updateOp = {}, whereOp = {}
        state && Object.assign(updateOp, { state })
        id && Object.assign(whereOp, { id })
        return Notifies.update(updateOp, { where: whereOp })
    }
}

export default new NotifyService()