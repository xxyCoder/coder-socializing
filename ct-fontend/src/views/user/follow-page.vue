<script setup lang="ts">
import { defineProps, ref, watchEffect } from 'vue'
import StickyList from '@/components/common/sticky-list.vue';
import UserItem from '@/components/user/user-item.vue';
import NullData from '@/components/common/null-data.vue';
import { getFollowList } from '@/api/users';
import { Follow } from './ts';

const props = defineProps({
  idx: {
    type: Number,
    default: 0
  }
})
let { idx } = props

watchEffect(() => {
  idx = props.idx
})

const pageNumObj: Record<number, number> = {
  [Follow.follower]: 0,
  [Follow.followed]: 0
}

const users = ref<Array<{ userId: number, username: string, avatarSrc: string, biography: string }>>([])

function reqListData(getMore = false) {
  getFollowList({ idx, page_num: pageNumObj[idx]++ })
    .then(res => {
      getMore ? users.value.push(...res.users) : users.value = res.users
    })
}
reqListData()

function handlerClick(_idx: number) {
  if (idx === _idx) return
  idx = _idx
  pageNumObj[idx] = 0
  reqListData()
}

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === users.value.length - 3) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            reqListData(true)
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
  <sticky-list :list="['关注者', '粉丝']" :init-idx="idx" @click="handlerClick" />
  <div class="container">
    <user-item v-for="(item, i) in users" :key="item.userId" v-intersect="i" :user-id="item.userId"
      :username="item.username" :avatar-src="item.avatarSrc" :biography="item.biography" />
    <null-data v-if="!users.length" />
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
</style>