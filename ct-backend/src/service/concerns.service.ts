import Concern from "@src/model/concerns.model";
import type { FollwerType } from "@src/constant/types";

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
}

export default new ConcernService();
