<script setup lang="ts">
import { ComponentInternalInstance, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNoteDetail, emitComment, getNoteComment, getNotifyComment, deleteNote, deleteComment } from '@/api/note'
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import NullData from '@/components/common/null-data.vue';
import Carousel from '@/components/common/carousel.vue';
import type { UserInfo, NoteInfo, Comment } from '@/common/types/index'
import Like from '@/components/common/like.vue';
import Collect from '@/components/common/collect.vue';
import CommentItem from '@/components/note/comment-item.vue';
import InTheEnd from '@/components/common/in-the-end.vue';
import UserHeader from '@/components/common/user-header.vue';
import { ReplyInfo } from '@/common/types';
import { useModNoteStore, useNoteInfoStore } from '@/store';
import { createComponentAPI } from '@/common/ts/create-component-API';
import Popup from '@/components/common/popup.vue';

const route = useRoute();
const router = useRouter()

const { id } = route.params;

let popupInstance: null | ComponentInternalInstance = null;
let unmount: () => void = () => {
  //empty
}
let delCommentInstance: null | ComponentInternalInstance = null;
let unmountDelCommentIns: () => void = () => {
  //empty
}
onBeforeUnmount(() => {
  setNoteInfo({ replyCommentId: null, commentId: null, rootCommentId: null })
  document.removeEventListener('click', handlerClick)
  // @ts-ignore
  popupInstance && popupInstance.exposed.hide()
  unmount()
  // @ts-ignore
  delCommentInstance && delCommentInstance.exposed.hide()
  unmountDelCommentIns()
})

const selfInfo = getUserInfo()
const note = ref<NoteInfo>()
const viewr = ref<UserInfo>()

const remove = useLoading();
getNoteDetail({ noteId: id })
  .then(({ note: _note, user }) => {
    remove();
    note.value = _note
    viewr.value = user
  })
  .catch(() => {
    remove();
  });


const commentList = ref<Comment[]>([])
const commentChildList = ref<Map<number, Comment[]>>(new Map())
const commentChildPageNums: Map<number, number> = new Map()
let pageNum = 0
const reqComment = (rootCommentId: number | null = null) => {
  let pn = pageNum;
  if (rootCommentId) {
    pn = commentChildPageNums.get(rootCommentId) || 0;
  }
  getNoteComment({
    noteId: id,
    page_num: pn,
    rootCommentId
  })
    .then(({ comments: _comments }) => {
      if (_comments.length) {
        if (rootCommentId) {
          const arr = commentChildList.value.get(rootCommentId) || [];
          arr.push(..._comments);
          commentChildList.value.set(rootCommentId, arr);
        } else {
          commentList.value.push(..._comments)
        }
        ++pn
        rootCommentId ? commentChildPageNums.set(rootCommentId, pn) : (pageNum = pn);
      }
    })
}
const { comment: { commentId }, setNoteInfo } = useNoteInfoStore()
commentId && getNotifyComment({ commentId })
  .then(({ comments: _comments }) => {
    const rootComment = _comments[0], replyComment = _comments[1], comment = _comments[2]
    commentList.value.unshift(rootComment)

    const arr = commentChildList.value.get(rootComment.id) || [];
    replyComment.id && arr.unshift(replyComment);
    comment.id && arr.unshift(comment);
    commentChildList.value.set(rootComment.id, arr);
  })

reqComment();

const comment = ref<string>('')
const replyInfo = ref<ReplyInfo>({ targetCommentId: null, username: '', comment: '', rootCommentId: null, replyUserId: null })
const commit = () => {
  if (!comment.value) return;
  if (!selfInfo) {
    return useToast('请先登录')
  }
  const noteId = note.value?.id;
  if (!noteId) {
    return useToast('网络错误');
  }
  const targetCommentId = replyInfo.value.targetCommentId, rootCommentId = replyInfo.value.rootCommentId
  emitComment({ noteId, comment: encodeURIComponent(comment.value), targetCommentId, rootCommentId, replyUserId: replyInfo.value.replyUserId || viewr.value?.userId })
    .then(res => {
      if (rootCommentId) {
        const arr = commentChildList.value.get(rootCommentId) || [];
        arr.unshift({ ...res, replyUsername: targetCommentId === rootCommentId ? "" : replyInfo.value.username, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } });
        commentChildList.value.set(rootCommentId, arr)
        commentList.value.forEach(c => {
          if (c.id === rootCommentId && c.replyCnt) {
            ++c.replyCnt
          }
        })
      } else {
        commentList.value.unshift({ ...res, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } })
      }
      comment.value = ''
    })
    .catch(() => {
      useToast('评论失败')
    })
  replyInfo.value.targetCommentId = replyInfo.value.rootCommentId = null;
}

const handlerReply = (info: ReplyInfo) => {
  replyInfo.value = info
}

const cancelReply = () => {
  replyInfo.value.targetCommentId = null
  comment.value = ''
}

const optPanel = ref(false)
const handlerNoteModify = () => {
  if (!note.value) {
    useToast('获取笔记详情失败')
    return
  }
  const { setModNoteInfo } = useModNoteStore()
  setModNoteInfo({
    noteId: note.value.id,
    mediaList: note.value.mediaList.split(';'),
    title: note.value.title,
    content: note.value.content,
    tag: note.value.tag,
    isVideo: note.value.isVideo
  })
  router.push({ path: '/publish', query: { noteId: note.value?.id, isMod: 'true' } })
}

const handlerNoteDelete = () => {
  if (!popupInstance) {
    ({ instance: popupInstance, unmount } = createComponentAPI(Popup, {
      content: '删除后笔记无法还原',
      onConfirm() {
        deleteNote({ noteId: note.value?.id })
          .then(() => {
            useToast('删除成功')
              .then(() => {
                router.replace('/explore')
              })
          })
      }
    }))
  }
  // @ts-ignore
  popupInstance.exposed.show()
}
const handlerClick = () => {
  optPanel.value = false
}
document.addEventListener('click', handlerClick)

function handlerDelComment(commentId: number, rtCommentId: number) {
  if (!delCommentInstance) {
    ({ instance: delCommentInstance, unmount: unmountDelCommentIns } = createComponentAPI(Popup, {
      content: '确认删除吗',
      onConfirm() {
        deleteComment({ noteId: note.value?.id, commentId })
          .then(() => {
            commentList.value = commentList.value.filter(c => c.id !== commentId) // 如果是根评论，则从所有根评论中移除该评论
            commentChildList.value.delete(commentId) // 如果是根评论则移除所有子评论
            const arr = commentChildList.value.get(rtCommentId) || []
            if (arr.length) { // 如果是子评论
              arr.splice(arr.findIndex(c => c.id === commentId), 1)
              commentList.value.forEach(c => {
                if (c.id === rtCommentId && c.replyCnt) {
                  --c.replyCnt
                }
              })
              commentChildList.value.set(commentId, arr)
            }
          })
      }
    }))
  }
  // @ts-ignore
  delCommentInstance.exposed.show()
}

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === commentList.value.length - 3) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reqComment();
            io.unobserve(entry.target)
          }
        })
      }, {
        threshold: 1
      })
      io.observe(el)
    }
  }
}
</script>

<template>
  <template v-if="note && viewr">
    <user-header :user="viewr">
      <div v-if="viewr.userId === selfInfo?.id || selfInfo?.permission" class="dots">
        <span @click.stop="optPanel = !optPanel">. . .</span>
        <transition>
          <ul class="opt-panel" v-if="optPanel">
            <li @click="handlerNoteModify">修改</li>
            <li @click="handlerNoteDelete">删除</li>
          </ul>
        </transition>
      </div>
    </user-header>
    <div class="note-page container">
      <div class="media-box">
        <video v-if="note.isVideo" :src="note.mediaList" controls></video>
        <carousel v-else :list="note.mediaList.split(';')" />
      </div>
      <div>
        <h3 class="title">{{ note.title }}</h3>
        <p class="content">{{ note.content }}</p>
        <span class="time">
          {{ (note.updateDate === note.createDate ? '发布于' : '编辑于')
            + ' '
            + new Date(note.updateDate).toLocaleString() }}
        </span>
      </div>
      <div class="comments">
        <div v-for="(item, i) in commentList" :key="item.id" v-intersect="i">
          <comment-item :username="item.user.username" :avatar-src="item.user.avatarSrc" :content="item.content"
            :comment-cnt="item.replies" :date="new Date(item.createdAt).toDateString()" :comment-id="item.id"
            :reply-cnt="item.replyCnt" :user-id="item.user.userId" :reply-comments="commentChildList.get(item.id)"
            :is-auth="viewr.userId === selfInfo?.id" @reply="handlerReply" @extend="reqComment"
            @delete="handlerDelComment" />
        </div>
        <in-the-end />
      </div>
    </div>
    <div class="interaction">
      <div class="reply-box" v-show="replyInfo.targetCommentId">
        <div class="flex-box">
          <span>回复 {{ replyInfo.username }}</span>
          <button @click="cancelReply">取消</button>
        </div>
        <p>{{ replyInfo.comment }}</p>
      </div>
      <div class="flex-box">
        <input class="comment" v-model="comment" type="text" placeholder="评论" />
        <button class="btn" @click="commit">发送</button>
        <div class="opts">
          <like :is-like="note.isLike" :likeCnt="note.likeCnt" :note-id="note.id" :author-id="viewr.userId" />
          <collect :is-collect="note.isCollect" :collect-cnt="note.collectCnt" :author-id="viewr.userId"
            :note-id="note.id" />
        </div>
      </div>
    </div>
  </template>
  <null-data v-else />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';
@import '../../common/style/global.scss';

.media-box {
  video {
    width: 100%;
  }
}

.content {
  font-size: 14px;
}

.time {
  color: hsla(0, 0%, 100%, 0.6);
  font-size: 12px;
}

.interaction {
  position: fixed;
  box-sizing: border-box;
  padding: responsive(12, vh) responsive(24, vw);
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
}

.reply-box {
  box-sizing: border-box;
  font-size: 14px;

  div {
    color: hsla(0, 0%, 100%, 0.6)
  }

  button {
    border: none;
    border-radius: responsive(20, vw);
    padding: responsive(6, vh) responsive(20, vw);
    background-color: #1e80ff;
    color: #fff;
  }

  p {
    color: hsla(0, 0%, 100%, 0.8);
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
}

.flex-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments {
  margin: 10px 0 responsive(100, vw);
}

.comment {
  border: none;
  margin-right: 5px;
  padding: responsive(12, vh) responsive(24, vw);
  border-radius: responsive(12, vh);
  color: hsla(0, 0%, 100%, 0.6);
  background-color: hsla(0, 0%, 100%, 0.1);
  outline: none;
  flex: 1;
}

.btn {
  border: none;
  background-color: #1e80ff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
}

.opts {
  display: flex;
  align-items: center;
}

.dots {
  position: relative;
  margin-left: responsive(30, vw);

  span {
    font-size: 20px;
  }
}

.opt-panel {
  position: absolute;
  top: responsive(60, vw);
  left: responsive(-15, vw);
  box-sizing: border-box;
  margin: 0;
  padding: 0 responsive(5, vw);
  border: 1px solid rgba(255, 255, 255, .6);
  border-radius: responsive(5, vw);
  list-style: none;

  li {
    box-sizing: border-box;
    padding: responsive(10, vw);
    white-space: nowrap;
    font-size: 15px;
  }

  li:first-child {
    border-bottom: 1px solid rgba(255, 255, 255, .6);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
