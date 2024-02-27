import LikeCollects, { LikeOrCollectModel } from "@src/model/likes-collect.model";

class LikeService {
    get({ userId, noteId, type }: { noteId?: number } & Pick<LikeOrCollectModel, 'userId' | 'type'>) {
        const whereOp = { userId, type };
        noteId && Object.assign(whereOp, { noteId })
        return LikeCollects.findAll({
            where: whereOp
        })
    }
    count({ noteId, type }: Pick<LikeOrCollectModel, 'noteId' | 'type'>) {
        return LikeCollects.count({ where: { noteId, type } })
    }
    add({ userId, noteId, type }: Omit<LikeOrCollectModel, 'id'>) {
        return LikeCollects.create({ userId, noteId, type })
    }
    remove({ userId, noteId, type }: Omit<LikeOrCollectModel, 'id'>) {
        return LikeCollects.destroy({ where: { userId, noteId, type } })
    }
}

export default new LikeService();
