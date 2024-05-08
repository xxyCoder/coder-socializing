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
  const total = ref(0), commetAndFollowCnt = ref(0), likeAndCollectCnt = ref(0), chatCnt = ref(0)
  function modifyTotal(cnt: number) {
    total.value += cnt
  }
  function addCommentAndFollowCnt() {
    ++commetAndFollowCnt.value
    modifyTotal(1)
  }
  function setCommentAndFollowCnt(cnt: number) {
    modifyTotal(-commetAndFollowCnt.value + cnt)
    commetAndFollowCnt.value = cnt
  }

  function addlikeAndCollectCnt() {
    ++likeAndCollectCnt.value
    modifyTotal(1)
  }
  function setlikeAndCollectCnt(cnt: number) {
    modifyTotal(-likeAndCollectCnt.value + cnt)
    likeAndCollectCnt.value = cnt
  }

  function setChatCnt(cnt: number) {
    modifyTotal(-chatCnt.value + cnt)
    chatCnt.value = cnt
  }
  function addChatCnt() {
    ++chatCnt.value
    modifyTotal(1)
  }

  return {
    total,
    commetAndFollowCnt, addCommentAndFollowCnt, setCommentAndFollowCnt,
    likeAndCollectCnt, addlikeAndCollectCnt, setlikeAndCollectCnt,
    chatCnt, setChatCnt, addChatCnt
  }
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