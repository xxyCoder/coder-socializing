<script setup lang="ts">
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import { getExploreNotes } from '@/api/note'
import { ref, watch } from 'vue';
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';
import { NoteCardType } from '@/common/types';
import AllNotes from '@/components/note/all-notes.vue';

const list = ['新鲜', '学习', '游戏', '互助', '美食'];
const listMap: Record<string, string> = { '新鲜': 'new', '学习': 'learn', '游戏': 'game', '互助': 'help', '美食': 'food' };
const tagPageNum: Record<string, number> = {
    'new': 0,
    'learn': 0,
    'game': 0,
    'help': 0,
    'food': 0
};

const tabId = ref(0)
const notes = ref<NoteCardType[]>([])
const getNotes = () => {
    const tag = listMap[list[tabId.value]];
    const remove = useLoading();
    getExploreNotes(`?category=${tag}&page_num=${tagPageNum[tag]}`)
        .then(res => {
            remove();
            res && notes.value.push(...res.notes)
        })
        .catch(err => {
            remove();
            useToast(err.message)
        })
}

watch(tabId, () => {
    notes.value = [];
    getNotes()
}, {
    immediate: true
})
</script>

<template>
    <sticky-list :list="list" @click="(id: number) => tabId = id" />
    <all-notes :show-infos="notes" />
    <bottom-menu />
</template>

<style scoped lang="scss"></style>
