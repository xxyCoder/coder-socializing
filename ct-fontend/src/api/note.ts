import { NoteCardType, NoteDetail } from "@/common/types";
import instance, { PostFirstArg } from "./config";

export const publishNote = instance.post<PostFirstArg, FormData>("/note/publish");

export const getViewerNote = instance.get<{ notes: NoteCardType[] }>("/note/viewer_note");

export const getNoteDetail = instance.get<NoteDetail>("/note/detail");

export const getTypeAllNote = instance.get<{ notes: NoteCardType[] }>("/note/type_note");
