<script setup lang="ts">
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import Notify from '@/components/notification/notify.vue';
import { ref } from 'vue';

const list = ['评论和@', '关注', '点赞和收藏', '私信']
const tabIdx = ref(0)
</script>

<template>
    <sticky-list :list="list" @click="(idx: number) => tabIdx = idx" />
    <notify :type="tabIdx" />
    <BottomMenu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
</style>