import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NoteInfo } from './types'

export const useNoteInfoStore = defineStore('note-info', () => {
    const noteInfo = ref({} as NoteInfo)
    function setNoteInfo(info: NoteInfo) {
        noteInfo.value = info
    }
    return { noteInfo, setNoteInfo }
})

export const useNotityCountStore = defineStore('notify-count', () => {
    const count = ref(0)
    function addCount() {
        ++count.value
    }
    return { count, addCount }
})