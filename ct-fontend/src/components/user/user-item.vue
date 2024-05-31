<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { backendStatic, ip, port } from '@/api/constant';

defineProps({
  userId: {
    type: Number,
    default: -1
  },
  avatarSrc: {
    type: String,
  },
  username: {
    type: String,
    default: '未知用户'
  },
  biography: {
    type: String,
    default: '这个人暂无简介'
  }
})

const emits = defineEmits(['click'])

const router = useRouter()

function viewUser(userId: number) {
  emits('click')
  router.push(`/user/${userId}`)
}
</script>

<template>
  <div class="user-item" @click="viewUser(userId)">
    <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
    <div class="user-info">
      <h5>{{ username }}</h5>
      <p>{{ biography || '这个人暂无简介' }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';
.user-item {
  margin-top: responsive(20, vw);
  display: flex;

  img {
    margin-right: responsive(10, vw);
    width: responsive(60, vw);
    height: responsive(60, vw);
    border-radius: 50%;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;

  h5 {
    margin: 0;
  }

  p {
    font-size: 12px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
}
</style>