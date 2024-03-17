import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NoteInfo } from './types'

export const useNoteInfoStore = defineStore('note-info', () => {
    const comment = ref({} as NoteInfo)
    function setNoteInfo(info: NoteInfo) {
        comment.value = info
    }
    return { comment, setNoteInfo }
})

export const useNotityCountStore = defineStore('notify-count', () => {
    const count = ref(0)
    function addCount() {
        ++count.value
    }
    function clearCount() {
        count.value = 0
    }
    return { count, addCount, clearCount }
})