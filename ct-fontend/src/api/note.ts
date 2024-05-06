import { Comment, NoteCardType, NoteDetail } from "@/common/types";
import instance from "./config";

export const publishNote = instance.post("/note/publish");

export const getViewerNote = instance.get<{ notes: NoteCardType[] }>("/note/viewer_note");

export const getNoteDetail = instance.get<NoteDetail>("/note/detail");

export const getExploreNotes = instance.get<{ notes: NoteCardType[] }>("/note/explore_note");

export const noteLikeOrCollect = instance.post("/note/like_or_collect");

export const emitComment = instance.post<Omit<Comment, 'user'> & { userId: number }>("/comment/emit_comment");

export const getNoteComment = instance.get<{ comments: Comment[] }>("/comment/note_comments");

export const getNotifyComment = instance.get<{ comments: Comment[] }>("/comment/note_notify_comment");

export const getRecommentNote = instance.get<{ notes: Array<{ id: number, title: string }> }>("/note/random")

export const deleteNote = instance.delete("/note/delete_note")

export const updateNote = instance.patch("/note/update_note")

export const deleteComment = instance.delete("/comment/delete_comment")
