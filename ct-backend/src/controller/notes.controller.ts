import type { Request, Response } from "express";
import LikesServe from "@src/service/likes.serve";
import { successObj } from "@src/constant/resp.constant";

const { add: likeAdd, remove: likeRev } = LikesServe;

class NoteController {
    like(req: Request, resp: Response) {
        const userId = req.query.id as string;
        const { noteId, is_like } = req.body;
        const params = { userId: Number(userId), noteId: Number(noteId) };
        (is_like === 'true' ? likeRev(params) : likeAdd(params))
            .then(row => {
                const ret = row ? successObj : { code: 400, msg: '不存在' }
                resp.send(ret);
            })
            .catch(err => {
                console.error(`操作笔记喜欢量错误：${err}`);
                resp.send({ code: 400, msg: '操作失败' });
            })
    }
}

export default new NoteController()