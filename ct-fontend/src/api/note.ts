import { Comment, NoteCardType, NoteDetail } from "@/common/types";
import instance, { PostFirstArg } from "./config";

export const publishNote = instance.post<PostFirstArg, FormData>("/note/publish");

export const getViewerNote = instance.get<{ notes: NoteCardType[] }>("/note/viewer_note");

export const getNoteDetail = instance.get<NoteDetail>("/note/detail");

export const getExploreNotes = instance.get<{ notes: NoteCardType[] }>("/note/explore_note");

export const noteLikeOrCollect = instance.post("/note/like_or_collect");

export const emitComment = instance.post("/comment/emit_comment");

export const getNoteComment = instance.get<{ comments: Comment[] }>("/comment/note_comments");
