import type { Request, Response } from "express";
import LikesServe from "@src/service/likes.serve";
import { serviceError, successObj } from "@src/constant/resp.constant";
import notesService from "@src/service/notes.service";

const { add: likeAdd, remove: likeRev } = LikesServe;
const { add: noteAdd } = notesService;

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
    publish(req: Request, resp: Response) {
        const userId = req.query.id as string;
        const { tag, title, content, atUserIds = [] } = req.body;
        const mediaList = req.files as Express.Multer.File[];
        noteAdd({
            tag, title, content,
            atUserIds: atUserIds.join(';'),
            userId: Number(userId),
            mediaList: mediaList.map(media => media.path).join(';')
        })
            .then(() => {
                resp.send(successObj)
            })
            .catch(err => {
                console.error(`发布错误：${err}`);
                resp.send(serviceError)
            })
    }
}

export default new NoteController()