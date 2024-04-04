import Note, { NoteModel } from "@src/model/notes.model";
import { categories, pageType } from "@src/constant/types";
import Users from "@src/model/users.model";
import LikeAndCollect from "@src/model/likes-collect.model";
import { Op } from "sequelize";
import { pageSize } from "@src/constant/resp.constant";

class NoteService {
    async getByPage({ userId, page_num, category }: { userId?: number, category: categories } & pageType) {
        const whereOp = {};
        userId && Object.assign(whereOp, { userId });
        const noteIds: number[] = [];
        if ([categories.like, categories.collect].includes(category)) {
            console.log(category)
            const res = await LikeAndCollect.findAll({ where: { ...whereOp, type: category } });
            console.log(res)
            res.forEach(likeOrCollect => noteIds.push(likeOrCollect.dataValues.noteId));
            if (noteIds.length === 0) return Promise.resolve([])
            Object.assign(whereOp, { id: { [Op.in]: noteIds } })
        }
        !([categories.note, categories.like, categories.collect] as string[]).includes(category) && Object.assign(whereOp, { tag: category });
        return Note.findAll({
            where: whereOp,
            offset: page_num * pageSize,
            limit: pageSize,
            order: [['createdAt', 'DESC']],
            include: [Users]
        });
    }
    add({ tag, title, content, mediaList, atUserIds, userId, isVideo }: Partial<NoteModel>) {
        const params = { title, tag, mediaList, userId, isVideo };
        content && Object.assign(params, { content });
        atUserIds && Object.assign(params, { atUserIds });
        return Note.create(params)
    }
    get(noteId: number) {
        return Note.findOne({ where: { id: noteId } });
    }
}

export default new NoteService()
