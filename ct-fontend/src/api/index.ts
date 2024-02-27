import instance from "./config";

export const follwerOrCancel = instance.post("/concern/follower_or_cancel");

export const noteLikeOrCollect = instance.post("/note/like_or_collect");