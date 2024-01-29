import { serviceError } from "@src/constant/resp.constant";
import concernsService from "@src/service/concerns.service";
import type { Request, Response } from "express";

const { remove, add } = concernsService;

class ConcernController {
    follwerOrCancel(req: Request, resp: Response) {
        const { id, viewer_id, is_follwer } = req.body;
        (is_follwer === 'true' ? remove({ id, viewer_id }) : add({ id, viewer_id }))
            .then(() => {
                resp.send({ code: 200, msg: '操作成功' });
            })
            .catch(err => {
                console.log(`关注或取消操作失败：${err}`);
                resp.send(serviceError);
            })
    }
}

export default new ConcernController();
