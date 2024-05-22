<script setup lang="ts">
import { ref } from 'vue';
import { getChatList } from '@/api/chat';
import BottomMenu from '@/components/common/bottom-menu.vue';
import NullData from '@/components/common/null-data.vue';
import MessageItem from '@/components/chat/message-item.vue';
import NotifyButton from '@/components/notification/notify-button.vue';
import { IMessageList } from './ts';
import { MessageTag } from '@/common/constant';
import { useToast } from '@/components/Toast';

const list = [{ name: '评论和关注', tag: MessageTag['comment-follow'] }, { name: '点赞和收藏', tag: MessageTag['like-collect'] }, { name: '发出的评论', tag: MessageTag['self-comment'] }]

let pageNum = 0
const messageList = ref<IMessageList[]>([])
const req = () => {
  getChatList({
    page_num: pageNum
  })
    .then(res => {
      messageList.value.push(...res.chatList)
      ++pageNum
    })
    .catch(err => {
      useToast(err.message)
    })
}
req()

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === messageList.value.length - 3) {
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
  <header class="container">
    <notify-button v-for="(item, idx) in list" :key="idx" :item="item" />
  </header>
  <div class="message-list container">
    <message-item v-for="(item, idx) in messageList" :key="item.userId" :user-id="item.userId" :username="item.username"
      :avatar-src="item.avatarSrc" :content="item.content" :time="+new Date(item.time)" :is-follower="item.isFollower"
      :unread-cnt="item.unreadCnt" v-intersect="idx" />
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
  position: relative;
  padding: responsive(20, vw);
  border-radius: responsive(10, vw);
  box-shadow: 0 0 responsive(20, vw) rgb(166 159 159 / 80%);
}

.cnt {
  position: absolute;
  right: responsive(-10, vw);
  top: responsive(-20, vw);
  color: #fff;
  background-color: rgb(249, 60, 60);
  border-radius: 50%;
  padding: responsive(10, vw);
  font-size: 12px;
}
</style>