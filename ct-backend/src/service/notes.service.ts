import Note, { NoteModel } from "@src/model/notes.model";
import { pageType } from "@src/constant/types";

class NoteService {
    getByPage({ userId, page_num, page_size }: { userId: number } & pageType) {
        return Note.findAll({
            where: { userId },
            offset: page_num * page_size,
            limit: page_size
        });
    }
    add({ tag, title, content, mediaList, atUserIds, userId }: Partial<NoteModel>) {
        const params = { title, tag, mediaList, userId };
        content && Object.assign(params, { content });
        atUserIds && Object.assign(params, { atUserIds });
        return Note.create(params)
    }
}

export default new NoteService()
