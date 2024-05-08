import { Notify } from "@/common/types/notify";
import instance from "./config";

export const getNotifyList = instance.get<Notify[]>('/notify/notify_list');

export const changeNotifyState = instance.post('/notify/change_status');

export const getNotifyCnt = instance.get<{ commentAndFollowCnt: number, likeAndCollectCnt: number, chatCnt: number }>('/notify/notify_cnt')

export const clearNotifyCnt = instance.post('/notify/clear_notify')
