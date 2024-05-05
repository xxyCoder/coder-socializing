<script setup lang="ts">
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import Notify from '@/components/notification/notify.vue';
import { ref } from 'vue';

const list = ['评论', '点赞和收藏', '关注', '发出的评论']
const tabIdx = ref(0)
</script>

<template>
  <sticky-list :list="list" @click="(idx: number) => tabIdx = idx" />
  <notify :type="tabIdx" :total="list.length" />
  <BottomMenu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
</style>