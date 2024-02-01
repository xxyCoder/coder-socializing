import Like, { LikeModel } from "@src/model/likes.model";

class LikeService {
    get({ userId, page_num, page_size }: { userId: number, page_num: number, page_size: number }) {
        Like.findAll({
            where: { userId },
            offset: page_num * page_size,
            limit: page_size
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
