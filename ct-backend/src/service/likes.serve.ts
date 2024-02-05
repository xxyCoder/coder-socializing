import Like, { LikeModel } from "@src/model/likes.model";

class LikeService {
    get({ userId }: { userId: number }) {
        return Like.findAll({
            where: { userId }
        })
    }
    add({ userId, noteId }: Omit<LikeModel, 'id'>) {
        return Like.create({ userId, noteId })
    }
    remove({ userId, noteId }: Omit<LikeModel, 'id'>) {
        return Like.destroy({ where: { userId, noteId } })
    }
}

export default new LikeService();
