import Note, { NoteModel } from "@src/model/notes.model";
import { categories, pageType } from "@src/constant/types";
import Users from "@src/model/users.model";
import { LikeOrCollectModel } from "@src/model/likes-collect.model";
import { Op } from "sequelize";
import { pageSize } from "@src/constant/resp.constant";
import LikesCollectServe from "./likes-collect.serve";

const { get: getLikeOrCollectList } = LikesCollectServe

class NoteService {
  async getByPage({ userId, page_num, category, question }: { userId?: number, category: categories, question?: string } & pageType) {
    const whereOp: Record<string, any> = {};
    const noteIds: number[] = [];
    userId && Object.assign(whereOp, { userId });
    if (question) {
      question = decodeURIComponent(question)
      let query = ''
      for (let i = 0, n = question.length; i < n; ++i) {
        query += `%${question[i]}`
      }
      query += '%'
      Object.assign(whereOp, {
        [Op.or]:
        {
          title: { [Op.like]: query },
          content: { [Op.like]: query }
        }
      })
    }

    if ([categories.like, categories.collect].includes(category)) {
      const res = await getLikeOrCollectList({ userId: userId!, type: category as LikeOrCollectModel["type"] });
      res.forEach(likeOrCollect => noteIds.push(likeOrCollect.dataValues.noteId));
      if (noteIds.length === 0) return Promise.resolve([])
      Object.assign(whereOp, { id: { [Op.in]: noteIds } })
      userId && (delete whereOp.userId)
    }
    !([categories.note, categories.like, categories.collect, categories.all] as string[]).includes(category) && Object.assign(whereOp, { tag: category });
    return Note.findAll({
      where: whereOp,
      offset: page_num * pageSize,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
      include: [Users]
    });
  }
  add({ tag, title, content, mediaList, userId, isVideo }: Partial<NoteModel>) {
    const params = { title, tag, mediaList, userId, isVideo };
    content && Object.assign(params, { content });
    return Note.create(params)
  }
  get(noteId: number) {
    return Note.findOne({ where: { id: noteId } });
  }
  countAll() {
    return Note.count()
  }
  remove({ noteId, userId }: { noteId: number, userId: number }) {
    return Note.destroy({ where: { id: noteId, userId } })
  }
  update({ tag, title, content, mediaList, userId, isVideo, id }: Partial<NoteModel>) {
    const updateOp = {}
    tag && Object.assign(updateOp, { tag })
    title && Object.assign(updateOp, { title })
    content && Object.assign(updateOp, { content })
    mediaList && Object.assign(updateOp, { mediaList })
    isVideo && Object.assign(updateOp, { isVideo })
    return Note.update(updateOp, { where: { id, userId } })
  }
}

export default new NoteService()
