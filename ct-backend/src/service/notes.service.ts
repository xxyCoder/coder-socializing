import Note, { NoteModel } from "@src/model/notes.model";
import { pageType } from "@src/constant/types";
import { categories } from "@src/middleware/common.middleware";
import Users from "@src/model/users.model";
import Likes from "@src/model/likes.model";
import { Op } from "sequelize";

class NoteService {
    async getByPage({ userId, page_num, page_size, category }: { userId: number, category: string } & pageType) {
        const whereOp = { userId };
        const noteIds: number[] = [];
        if (category === categories.like) {
            const res = await Likes.findAll({ where: whereOp });
            res.forEach(like => noteIds.push(like.dataValues.noteId));
            if (noteIds.length === 0) return Promise.resolve([])
            Object.assign(whereOp, { id: { [Op.in]: noteIds } })
        }
        !([categories.note, categories.like] as string[]).includes(category) && Object.assign(whereOp, { tag: category });
        return Note.findAll({
            where: whereOp,
            offset: page_num * page_size,
            limit: page_size,
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
}

export default new NoteService()
