import Notifies, { NotifyModel } from "@src/model/notify.model";
import Users from "@src/model/users.model";
import { Op } from "sequelize";

class NotifyService {
    add({ type, userId, replyCommentId, commentId, noteId, state }: NotifyModel) {
        return Notifies.create({ type, userId, replyCommentId, commentId, noteId, state })
    }
    list({ type }: { type: number[] }) {
        return Notifies.findAll({
            where: { type: { [Op.in]: type } },
            order: [['createdAt', 'DESC']],
            include: [Users]
        })
    }
}

export default new NotifyService()