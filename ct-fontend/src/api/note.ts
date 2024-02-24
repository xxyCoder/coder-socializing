import { NoteCardType, NoteDetail } from "@/common/types";
import instance, { PostFirstArg } from "./config";

export const publishNote = instance.post<PostFirstArg, FormData>("/note/publish");

export const getViewerNote = instance.get<{ notes: NoteCardType[] }>("/note/viewer_note");

export const getNoteDetail = instance.get<NoteDetail>("/note/detail");

export const getExploreNotes = instance.get<{ notes: NoteCardType[] }>("/note/explore_note");
