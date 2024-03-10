import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CommentNotify } from '@/common/types/notify'

export const useCommentNotifyStore = defineStore('comment-notify', () => {
    const commentNofityList = ref<CommentNotify[]>([])
    function addCommentNotify(notify: CommentNotify) {
        commentNofityList.value.unshift(notify)
    }
    function setCommentNotifyList(notifyList: CommentNotify[]) {
        commentNofityList.value.push(...notifyList);
    }

    return { commentNofityList, addCommentNotify, setCommentNotifyList }
})
