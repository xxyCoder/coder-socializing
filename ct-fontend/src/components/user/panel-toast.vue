<script setup lang="ts">
import { PropType, defineProps, defineExpose, defineEmits, ref } from 'vue';
import UserItem from './user-item.vue'

const props = defineProps({
  users: {
    type: Array as PropType<Array<{ userId: number, username: string, avatarSrc: string, biography: string, isFollower: boolean }>>,
    default() {
      return []
    }
  }
})

const isShow = ref(false)
function show() {
  isShow.value = true
}
function hide() {
  isShow.value = false
}
defineExpose({
  show,
  hide
})

const emits = defineEmits(['needMore'])
const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === props.users.length - 3) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            emits('needMore')
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
  <div class="mask" v-if="isShow">
    <div class="panel-toast">
      <div class="title">
        <h5>搜索结果</h5>
        <span @click="hide">关闭</span>
      </div>
      <div class="content">
        <user-item v-for="(item, i) in users" :key="item.userId" v-intersect="i" :user-id="item.userId"
          :username="item.username" :avatar-src="item.avatarSrc" :biography="item.biography" @click="hide" />
        <div class="no-user" v-if="!users.length">没有该用户哦~</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.mask {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.8);
}

.panel-toast {
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: responsive(20, vw);
  width: 60vw;
  padding: responsive(20, vw);
  background-color: #000;
  color: #fff;
}

.title {
  display: flex;
  justify-content: space-between;

  h5 {
    margin: 0;
  }

  span {
    font-size: 12px;
  }
}

.content {
  max-height: 50vh;
  overflow: auto;
}

.no-user {
  margin-top: responsive(20, vw);
  font-size: 14px;
}
</style>