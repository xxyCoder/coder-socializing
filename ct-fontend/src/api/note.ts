import instance, { PostFirstArg } from "./config";

export const publishNote = instance.post<PostFirstArg, FormData>("/note/publish");
