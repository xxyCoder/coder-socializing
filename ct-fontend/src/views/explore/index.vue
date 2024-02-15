<script setup lang="ts">
import BottomMenu from '@/components/bottom-menu.vue';
import StickyList from '@/components/sticky-list.vue';
import { getTypeAllNote } from '@/api/note'

const list = ['新鲜', '学习', '游戏', '互助', '美食'];
const listMap: Record<string, string> = { '新鲜': 'new', '学习': 'learn', '游戏': 'game', '互助': 'help', '美食': 'food' };
const tagPageNum: Record<string, number> = {
    'new': 0,
    'learn': 0,
    'game': 0,
    'help': 0,
    'food': 0
}
const getNotes = (idx: number) => {
    const tag = listMap[list[idx]];
    getTypeAllNote(`?tag=${tag}&category=note&page_num=${tagPageNum[tag]}`)
}
</script>

<template>
    <sticky-list :list="list" @click="getNotes" />
    <bottom-menu />
</template>

<style scoped lang="scss"></style>
