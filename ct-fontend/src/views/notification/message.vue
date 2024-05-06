<script setup lang="ts">
import { PropType, defineProps, reactive } from 'vue'
import { Notify } from '@/common/types/notify';
import NotifyItem from '@/components/notification/notify-item.vue';
import nullData from '@/components/common/null-data.vue';
import { MessageTag } from './ts';
import { getNotifyList } from '@/api/notify';

const props = defineProps({
  tag: {
    type: String as PropType<MessageTag>,
    default: MessageTag['comment-follow']
  }
})
const notifyList = reactive<Array<Notify>>([])

let pageNum = 0
getNotifyList({ tag: props.tag, page_num: pageNum })
  .then(res => {
    notifyList.push(...res)
  })
</script>

<template>
  <div class="container">
    <notify-item v-for="item in notifyList" :key="item.id" :notify-id="item.id" :user-id="item.userId"
      :username="item.username" :avatar-src="item.avatarSrc" :note-id="item.noteId" :title="item.title"
      :comment-id="item.commentId" :reply-comment-id="item.replyCommentId" :content="item.content"
      :reply-content="item.replyContent" :time="item.time" :status="item.status" :type="item.type"
      :root-comment-id="item.rootCommentId" />
    <null-data v-if="!notifyList.length" />
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
</style>