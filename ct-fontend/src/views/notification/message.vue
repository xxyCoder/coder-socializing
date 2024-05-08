<script setup lang="ts">
import { PropType, defineProps, reactive } from 'vue'
import { Notify } from '@/common/types/notify';
import NotifyItem from '@/components/notification/notify-item.vue';
import nullData from '@/components/common/null-data.vue';
import { clearNotifyCnt, getNotifyList } from '@/api/notify';
import { MessageTag } from '@/common/constant';
import { useRouter } from 'vue-router';
import { clearTypeNotifyCnt } from '@/common/ts/notify';
import { useToast } from '@/components/Toast';
import { NotifyItemStateMap } from '@/components/notification/notify';

const props = defineProps({
  tag: {
    type: String as PropType<MessageTag>,
    default: MessageTag['comment-follow']
  }
})

const router = useRouter()

const notifyList = reactive<Array<Notify>>([])

let pageNum = 0
const req = () => {
  getNotifyList({ tag: props.tag, page_num: pageNum })
    .then(res => {
      notifyList.push(...res)
      ++pageNum
    })
}
req()

function clearUnreadMes() {
  clearNotifyCnt({ tag: props.tag })
    .then(() => {
      clearTypeNotifyCnt(props.tag)
      notifyList.forEach(item => item.status = NotifyItemStateMap.read)
    })
    .catch(() => {
      useToast('清除失败')
    })
}

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === notifyList.length - 3) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            req()
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
  <div class="container">
    <div class="clear-unread">
      <span @click="router.back()">返回</span>
      <button @click="clearUnreadMes" v-if="tag !== MessageTag['self-comment']">清空未读消息</button>
    </div>
    <notify-item v-for="(item, idx) in notifyList" :key="item.id" :notify-id="item.id" :user-id="item.userId"
      :username="item.username" :avatar-src="item.avatarSrc" :note-id="item.noteId" :title="item.title"
      :comment-id="item.commentId" :reply-comment-id="item.replyCommentId" :content="item.content"
      :reply-content="item.replyContent" :time="item.time" :status="item.status" :type="item.type"
      :root-comment-id="item.rootCommentId" :is-del="item.isDel" v-intersect="idx"
      @click="item.status = NotifyItemStateMap.read" />
    <null-data v-if="!notifyList.length" />
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
@import '../../common/style/func.scss';

.clear-unread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: responsive(10, vw);

  button {
    color: #fff;
    font-size: 12px;
    background-color: #1e80ff;
    border: none;
    padding: responsive(5, vw) responsive(10, vw);
    border-radius: responsive(10, vw);
  }

  span {
    font-size: 14px;
  }
}
</style>