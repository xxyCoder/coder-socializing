<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import io from 'socket.io-client'
import MessageBar from '@/components/chat/message-bar.vue';
import UserHeader from '@/components/common/user-header.vue';
import { useviewerStore } from '@/store';
import { useToast } from '@/components/Toast';
import { addChatBar } from '@/api/chat'
import { SOCKETPORT, ip } from '@/api/constant';
import { getUserInfo } from '@/common/ts/user-info';
import { IMessageBar } from './ts';
import { Direction, MessageStatus } from '@/components/chat';

const user = useviewerStore().viewer
const self = getUserInfo()
const socket = io(`${ip}:${SOCKETPORT}`)
socket.emit('online', self?.id)

socket.on('reply', data => {
    console.log(data)
})
onBeforeUnmount(() => {
    socket.emit('offline', self?.id)
})

const messageList = ref<IMessageBar[]>([])
const message = ref('')
const sendChatReq = (idx: number) => {
    messageList.value[idx].status = MessageStatus.LOADING
    addChatBar({ receiverId: user.userId, content: messageList.value[idx].content })
        .then(() => {
            messageList.value[idx].status = MessageStatus.NORMAL
        })
        .catch(() => {
            messageList.value[idx].status = MessageStatus.ERROR
        })
}
const sendMessage = () => {
    if (!self?.id) {
        useToast('请先登录')
        return
    }
    if (!message.value) {
        useToast('消息不能为空')
        return
    }
    messageList.value.push({ content: message.value, sendDate: Date.now(), status: MessageStatus.LOADING, dir: Direction.RIGHT })
    sendChatReq(messageList.value.length - 1)
    message.value = ''
}

const handlerRetry = (idx: number) => {
    if (idx < 0 || idx >= messageList.value.length || messageList.value[idx].status !== MessageStatus.ERROR) return
    sendChatReq(idx)
}
</script>

<template>
    <user-header :user="user" />
    <div class="chat-page">
        <message-bar v-for="(msg, i) in messageList" :key="i" :idx="i" :content="msg.content" :status="msg.status"
            :send-date="msg.sendDate" :dir="msg.dir"
            :avatar-src="msg.dir === Direction.RIGHT ? self?.avatarSrc : user.avatarSrc" @retry="handlerRetry" />
    </div>
    <div class="send-message">
        <input v-model="message" type="text" />
        <button @click="sendMessage">发送</button>
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.chat-page {
    flex: 1;
    padding: responsive(20, vw);
    background-color: #242526;
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
