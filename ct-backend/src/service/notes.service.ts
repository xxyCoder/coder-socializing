import Note from "@src/model/notes.model";
import { pageType } from "@src/constant/types";

class NoteService {
    getByPage({ userId, page_num, page_size }: { userId: number } & pageType) {
        return Note.findAll({
            where: { userId },
            offset: page_num * page_size,
            limit: page_size
        });
    }
}

export default new NoteService()
