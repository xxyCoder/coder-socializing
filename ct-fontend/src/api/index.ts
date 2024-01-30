import instance, { type PostFirstArg } from "./config";

export const follwerOrCancel = instance.post("/concern/follower_or_cancel");

export const noteLike = instance.post("/note/like");