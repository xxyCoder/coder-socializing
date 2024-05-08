import { getNotifyCnt } from "@/api/notify"
import { useNotityCountStore } from "@/store"
import { MessageTag } from "../constant"
import { useRoute, useRouter } from "vue-router"

export function setNotifyCnt() {
  getNotifyCnt()
    .then(res => {
      const note = useNotityCountStore()
      note.setChatCnt(res.chatCnt)
      note.setCommentAndFollowCnt(res.commentAndFollowCnt)
      note.setlikeAndCollectCnt(res.likeAndCollectCnt)
    })
}

const router = useRouter()
export function addNotifyCnt(type: string) {
  const notify = useNotityCountStore()
  switch (type) {
    case MessageTag["comment-follow"]:
      notify.addCommentAndFollowCnt()
      break
    case MessageTag["like-collect"]:
      notify.addlikeAndCollectCnt()
      break
    case MessageTag.chat:
      notify.addChatCnt()
      if (location.hash.slice(1) === '/notification') {
        location.reload()
      }
      break
  }
}

export function clearTypeNotifyCnt(type: string) {
  const notify = useNotityCountStore()
  switch (type) {
    case MessageTag["comment-follow"]:
      notify.setCommentAndFollowCnt(0)
      break
    case MessageTag["like-collect"]:
      notify.setlikeAndCollectCnt(0)
      break
    case MessageTag.chat:
      notify.setChatCnt(0)
      break
  }
}