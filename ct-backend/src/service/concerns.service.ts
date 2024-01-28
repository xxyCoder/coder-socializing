import Concern from "@src/model/concerns.model";

class ConcernService {
    search({ id, viewer_id }: { id?: number, viewer_id?: number }) {
        if (!id || !viewer_id) return Promise.resolve(false);
        return Concern.findOne({ where: { follower: id, followed: viewer_id } })
            .then(res => res ? true : false)
    }
}

export default new ConcernService();
