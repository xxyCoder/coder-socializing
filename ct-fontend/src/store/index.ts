import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Notify } from '@/common/types/notify'
import { NoteInfo } from './types'

export const useCommentAndAtNotifyStore = defineStore('comment-at-notify', () => {
    const commentAtNofityList = ref<Notify[]>([])
    function addCommentAtNotify(notify: Notify) {
        commentAtNofityList.value.unshift(notify)
    }
    function setCommentAtNotifyList(notifyList: Notify[]) {
        commentAtNofityList.value.push(...notifyList);
    }

    return { commentAtNofityList, addCommentAtNotify, setCommentAtNotifyList }
})

export const useNoteInfoStore = defineStore('note-info', () => {
    const noteInfo = ref({} as NoteInfo)
    function setNoteInfo(info: NoteInfo) {
        noteInfo.value = info
    }
    return { noteInfo, setNoteInfo }
})
