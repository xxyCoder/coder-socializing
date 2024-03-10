import { CommentNotify } from "@/common/types/notify";
import instance from "./config";

export const getCommentNotifyList = instance.get<CommentNotify[]>('/comment/notify');