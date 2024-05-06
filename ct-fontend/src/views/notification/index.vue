<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getChatList } from '@/api/chat';
import BottomMenu from '@/components/common/bottom-menu.vue';
import NullData from '@/components/common/null-data.vue';
import MessageItem from '@/components/chat/message-item.vue';
import { IMessageList, MessageTag } from './ts';

const router = useRouter()

const list = [{ name: '评论和关注', tag: MessageTag['comment-follow'] }, { name: '点赞和收藏', tag: MessageTag['like-collect'] }, { name: '发出的评论', tag: MessageTag['self-comment'] }]
function viewNotifyDetail(idx: number) {
  router.push({ path: '/message', query: { tag: list[idx].tag } })
}

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
  <div class="container">
    <header>
      <div class="btn" v-for="(item, idx) in list" :key="idx" @click="viewNotifyDetail(idx)">{{ item.name }}</div>
    </header>
  </div>
  <div class="message-list container">
    <message-item v-for="item in messageList" :key="item.userId" :user-id="item.userId" :username="item.username"
      :avatar-src="item.avatarSrc" :content="item.content" :time="+new Date(item.time)"
      :is-follower="item.isFollower" />
    <null-data v-if="!messageList.length" />
  </div>
  <bottom-menu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
@import '../../common/style/func.scss';

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  box-sizing: border-box;
  padding: responsive(20, vw);
  border-radius: responsive(10, vw);
  box-shadow: 0 0 responsive(20, vw) rgb(166 159 159 / 80%);
}
</style>