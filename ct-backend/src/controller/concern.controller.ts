import { NotifyStateMap, NotifyTypeMap } from "@src/constant/notify";
import { serviceError } from "@src/constant/resp.constant";
import { getSSEConn } from "@src/router/sse.router";
import concernsService from "@src/service/concerns.service";
import NotifyController from '@src/controller/notify.controller'
import type { Request, Response } from "express";

const { remove, add } = concernsService;
const { addNotify } = NotifyController

class ConcernController {
    follwerOrCancel(req: Request, resp: Response) {
        const { id, viewer_id, is_follwer } = req.body;
        (is_follwer ? remove({ id, viewer_id }) : add({ id, viewer_id }))
            .then(() => {
                if (!is_follwer) {
                    addNotify({ type: NotifyTypeMap.concern, state: NotifyStateMap.unread, userId: viewer_id })
                        .then(() => {
                            // 如果在线就通知
                            const sse = getSSEConn(String(viewer_id))
                            sse && sse.write({ data: { type: 'notify' } })
                        })
                        .catch(err => {
                            console.error(`${viewer_id}通知失败:${err}`)
                        })
                }
                resp.send({ code: 200, msg: '操作成功' });
            })
            .catch(err => {
                console.log(`关注或取消操作失败：${err}`);
                resp.send(serviceError);
            })
    }
}

export default new ConcernController();
