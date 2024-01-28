import LikeModel from "@src/model/likes.model";

class LikeService {
    get({ userId, page_num, page_size }: { userId: number, page_num: number, page_size: number }) {
        LikeModel.findAll({
            where: { userId },
            offset: page_num * page_size,
            limit: page_size
        })
    }
}

export default new LikeService();
