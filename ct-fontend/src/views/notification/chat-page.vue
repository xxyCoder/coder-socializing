<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue';
import io from 'socket.io-client'
import MessageBar from '@/components/chat/message-bar.vue';
import UserHeader from '@/components/common/user-header.vue';
import { useviewerStore } from '@/store';
import { useToast } from '@/components/Toast';
import { addChatBar, getChatContent } from '@/api/chat'
import { SOCKETPORT, ip } from '@/api/constant';
import { getUserInfo } from '@/common/ts/user-info';
import { IMessageBar } from './ts';
import { Direction, MessageStatus } from '@/components/chat';

const messageList = ref<IMessageBar[]>([])

const user = useviewerStore().viewer
const self = getUserInfo()
const socket = io(`${ip}:${SOCKETPORT}`)
socket.emit('online', self?.id)
let pageNum = 0

socket.on('reply', data => {
  messageList.value.unshift({ content: data.content, sendDate: data.time, dir: data.senderId === user.userId ? Direction.LEFT : Direction.RIGHT, status: MessageStatus.NORMAL })
})
onBeforeUnmount(() => {
  socket.emit('offline', self?.id)
})

const message = ref('')
const chatPage = ref()

const gotoBottom = () => {
  nextTick(() => {
    chatPage.value.scrollIntoView(false)
  })
}

const sendChatReq = (idx: number) => {
  const message = messageList.value[idx]
  message.status = MessageStatus.LOADING
  addChatBar({ receiverId: user.userId, content: encodeURIComponent(messageList.value[idx].content) })
    .then(() => {
      message.status = MessageStatus.NORMAL
    })
    .catch(() => {
      message.status = MessageStatus.ERROR
    })
}

let hasMore = true
const getContent = (toBottom = false) => {
  if (!hasMore) return
  getChatContent({ page_num: pageNum, receiverId: user.userId })
    .then(res => {
      ++pageNum
      res.chatList.forEach(chat => {
        messageList.value.push({ content: chat.content, sendDate: chat.data, dir: chat.id === user.userId ? Direction.LEFT : Direction.RIGHT, status: MessageStatus.NORMAL })
      })
      toBottom && gotoBottom()
      if (!res.chatList.length) hasMore = false
    })
}
getContent(true)
const sendMessage = () => {
  if (!self?.id) {
    useToast('请先登录')
    return
  }
  if (!message.value) {
    useToast('消息不能为空')
    return
  }
  messageList.value.unshift({ content: message.value, sendDate: Date.now(), status: MessageStatus.LOADING, dir: Direction.RIGHT })
  sendChatReq(0)
  message.value = ''
  gotoBottom()
}

const handlerRetry = (idx: number) => {
  if (idx < 0 || idx >= messageList.value.length || messageList.value[idx].status !== MessageStatus.ERROR) return
  sendChatReq(idx)
}

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === messageList.value.length - 2) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            getContent()
            io.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.1
      })
      io.observe(el)
    }
  }
}
</script>

<template>
  <div class="page">
    <user-header :user="user" />
    <div class="chat-page" ref="chatPage">
      <message-bar v-for="(msg, i) in messageList" :key="i" :idx="i" :content="msg.content" :status="msg.status"
        :send-date="msg.sendDate" :dir="msg.dir"
        :avatar-src="msg.dir === Direction.RIGHT ? self?.avatarSrc : user.avatarSrc" @retry="handlerRetry(i)"
        v-intersect="i" />
    </div>
    <div class="send-message">
      <input v-model="message" type="text" />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.page {
  background-color: #242526;
  min-height: 100vh;
}

.chat-page {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  padding: responsive(20, vw);
  padding-bottom: responsive(120, vw);
  overflow: auto;
}

.send-message {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #000;
  padding: responsive(30, vw) responsive(20, vw);

  input {
    flex: 1;
    border: none;
    outline: none;
    margin-right: responsive(20, vw);
    padding: 0 responsive(10, vw);
    height: responsive(60, vw);
    border-radius: responsive(20, vw);
    background-color: #242526;
    color: #fff;
  }

  button {
    box-sizing: border-box;
    border: none;
    padding: responsive(12, vw) responsive(32, vw);
    border-radius: responsive(12, vw);
    background-color: #1e80ff;
    color: #fff;
  }
}
</style>
