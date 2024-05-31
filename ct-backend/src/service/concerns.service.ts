import Concern from "@src/model/concerns.model";
import type { FollwerType } from "@src/constant/types";
import { pageSize } from "@src/constant/resp.constant";

class ConcernService {
  async search({ id, viewer_id }: Partial<FollwerType>) {
    if (!id || !viewer_id) return Promise.resolve(false);
    const res = await Concern.findOne({ where: { follower: id, followed: viewer_id } });
    return res ? true : false;
  }
  add({ id, viewer_id }: FollwerType) {
    return Concern.create({ follower: id, followed: viewer_id })
  }
  remove({ id, viewer_id }: FollwerType) {
    return Concern.destroy({
      where: { follower: id, followed: viewer_id }
    })
  }
  count({ follower, followed }: { follower?: number, followed?: number }) {
    const whereOp = {}
    follower && Object.assign(whereOp, { follower })
    followed && Object.assign(whereOp, { followed })
    return Concern.count({
      where: whereOp
    })
  }
  searchByPage({ page_num, followed, follower }: { page_num: number, follower?: number, followed?: number }) {
    const whereOp = {}
    follower && Object.assign(whereOp, { follower })
    followed && Object.assign(whereOp, { followed })
    return Concern.findAll({
      where: whereOp,
      limit: pageSize,
      offset: pageSize * page_num
    })
  }
}

export default new ConcernService();
