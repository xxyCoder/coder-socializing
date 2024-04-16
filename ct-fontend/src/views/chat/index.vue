<script setup lang="ts">
import { getChatList } from '@/api/chat';
import BottomMenu from '@/components/common/bottom-menu.vue';
import MessageItem from '@/components/chat/message-item.vue';
import { ref } from 'vue';
import { IMessageList } from './ts';

let pageNum = 0
const messageList = ref<IMessageList[]>([])
getChatList({
  page_num: pageNum
})
  .then(res => {
    messageList.value.push(...res.chatList)
  })
</script>

<template>
  <div class="message-list">
    <message-item v-for="item in messageList" :key="item.userId" :user-id="item.userId" :username="item.username"
      :avatar-src="item.avatarSrc" :content="item.content" :time="+new Date(item.time)"
      :is-follower="item.isFollower" />
  </div>
  <bottom-menu />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.message-list {
  box-sizing: border-box;
  padding: responsive(20, vw);
}
</style>
