import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ModNote, NoteInfo, ViewerInfo } from './types'

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

export const useviewerStore = defineStore('viewer', () => {
  const viewer = ref<ViewerInfo>({
    username: '',
    avatarSrc: '',
    userId: NaN,
    isFollower: false
  })
  function setViewerInfo(info: ViewerInfo) {
    viewer.value = info
  }

  return { viewer, setViewerInfo }
})

export const useModNoteStore = defineStore('mod-note', () => {
  const note = ref<ModNote>({
    noteId: 0,
    title: '',
    content: '',
    mediaList: [],
    isVideo: false,
    tag: ''
  })

  function setModNoteInfo(noteInfo: ModNote) {
    note.value = noteInfo
  }

  return { note, setModNoteInfo }
})