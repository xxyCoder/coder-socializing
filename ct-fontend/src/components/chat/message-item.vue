<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { ip, port, backendStatic } from '@/api/constant';
import { DAY, HOUR, MIN } from '@/common/constant';
import { useRouter } from 'vue-router';
import { useviewerStore } from '@/store';
import { changeChatState } from '@/api/chat';
import { setNotifyCnt } from '@/common/ts/notify';

const props = defineProps({
  userId: {
    type: Number,
    default: NaN
  },
  username: {
    type: String,
    default: '未知用户'
  },
  avatarSrc: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    defalut: ''
  },
  time: {
    type: Number,
    default: 0
  },
  isFollower: {
    type: Boolean,
    default: false
  },
  unreadCnt: {
    type: Number,
    default: 0
  }
})

const timeText = computed(() => {
  const cur = Date.now(), prev = new Date(props.time)
  if (cur - props.time < MIN) {
    return '刚刚'
  } else if (cur - props.time < HOUR) {
    return `${new Date(cur).getMinutes() - prev.getMinutes()}分钟前`
  } else if (cur - props.time < 2 * HOUR) {
    return '1小时前'
  } else if (cur - props.time < DAY && new Date(cur).getDate() === prev.getDate()) {
    return `${new Date(props.time).getHours()}:${prev.getMinutes()}`
  } else if (cur - props.time < 2 * DAY) {
    return '昨天'
  } else if (new Date(cur).getFullYear() === prev.getFullYear()) {
    return `${prev.getMonth() + 1}/${prev.getDate()}`
  } else {
    return `${prev.getFullYear()}/${prev.getMonth() + 1}/${prev.getDate()}`
  }
})

const router = useRouter()
const gotoChat = () => {
  useviewerStore().setViewerInfo({ userId: props.userId, username: props.username, avatarSrc: props.avatarSrc, isFollower: props.isFollower })
  router.push(`/chat/${props.userId}`)
  changeChatState({ senderId: props.userId })
    .then(() => {
      setNotifyCnt()
    })
}

const unreadCntTxt = computed(() => props.unreadCnt < 100 ? `${props.unreadCnt}` : 'x99')
</script>

<template>
  <div class="message-item" @click="gotoChat">
    <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
    <div class="item-right">
      <div>{{ username }}</div>
      <div class="content">
        <p>{{ content }}</p>
        <span>{{ timeText }}</span>
      </div>
    </div>
    <div class="cnt" v-if="unreadCnt">{{ unreadCntTxt }}</div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.message-item {
  margin-top: responsive(20, vw);
  display: flex;
  align-items: center;
  overflow: hidden;

  img {
    margin-right: responsive(20, vw);
    width: responsive(80, vw);
    height: responsive(80, vw);
    border-radius: 50%;
  }
}

.item-right {
  overflow: hidden;
  flex: 1;
}

.content {
  flex: 1;
  display: flex;
  margin-top: responsive(10, vw);
  font-size: 14px;
  color: #ccc;
  overflow: hidden;

  p {
    flex: 1;
    margin: 0;
    margin-right: responsive(10, vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.cnt {
  border-radius: 50%;
  margin-left: responsive(10, vw);
  padding: responsive(5, vw) responsive(10, vw);
  font-size: 12px;
  color: #fff;
  background-color: rgb(249, 60, 60);
}
</style>
