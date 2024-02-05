import instance, { PostFirstArg } from "./config";

export const publishNote = instance.post<PostFirstArg, FormData>("/note/publish");

export const getViewerNote = instance.get("/note/viewer_note");
