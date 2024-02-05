import Note, { NoteModel } from "@src/model/notes.model";
import { pageType } from "@src/constant/types";
import { categories } from "@src/middleware/common.middleware";
import Users from "@src/model/users.model";
import Likes from "@src/model/likes.model";

class NoteService {
    getByPage({ userId, page_num, page_size, category }: { userId: number, category: string } & pageType) {
        const whereOp = { userId };
        !([categories.note, categories.like] as string[]).includes(category) && Object.assign(whereOp, { tag: category })
        const include = [Users];
        category === categories.like && include.push(Likes);
        return Note.findAll({
            where: whereOp,
            offset: page_num * page_size,
            limit: page_size,
            order: [['createdAt', 'DESC']],
            include
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
