import Like, { LikeModel } from "@src/model/likes.model";

class LikeService {
    get({ userId, noteId }: { userId: number, noteId?: number }) {
        const whereOp = { userId };
        noteId && Object.assign(whereOp, { noteId })
        return Like.findAll({
            where: whereOp
        })
    }
    count({ noteId }: { noteId: number }) {
        return Like.count({ where: { noteId } })
    }
    add({ userId, noteId }: Omit<LikeModel, 'id'>) {
        return Like.create({ userId, noteId })
    }
    remove({ userId, noteId }: Omit<LikeModel, 'id'>) {
        return Like.destroy({ where: { userId, noteId } })
    }
}

export default new LikeService();
