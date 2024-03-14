import { Notify } from "@/common/types/notify";
import instance from "./config";

export const getCommentAndAtNotifyList = instance.get<Notify[]>('/notify/notify_list');

export const changeNotifyState = instance.post<{ notifyId: number }>('/notify/change_status');
