import LikeOrCollects, { LikeOrCollectModel } from "@src/model/likes-collect.model";

class LikeOrCollectService {
  get({ userId, noteId, type }: { noteId?: number } & Pick<LikeOrCollectModel, 'userId' | 'type'>) {
    const whereOp = { userId, type };
    noteId && Object.assign(whereOp, { noteId })
    return LikeOrCollects.findAll({
      where: whereOp
    })
  }
  count({ noteId, type }: Pick<LikeOrCollectModel, 'noteId' | 'type'>) {
    return LikeOrCollects.count({ where: { noteId, type } })
  }
  async add({ userId, noteId, type }: Omit<LikeOrCollectModel, 'id'>) {
    const whereOp = { userId, noteId, type }
    await LikeOrCollects.restore({ where: whereOp })
    return LikeOrCollects.findOrCreate({ where: whereOp });
  }
  remove({ userId, noteId, type }: Omit<LikeOrCollectModel, 'id'>) {
    return LikeOrCollects.destroy({ where: { userId, noteId, type } })
  }
}

export default new LikeOrCollectService();
