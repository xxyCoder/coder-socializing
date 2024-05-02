<script setup lang="ts">
import { ref, watch } from 'vue';
import { getExploreNotes } from '@/api/note'
import { useLoading } from '@/components/Loading';
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import AllNotes from '@/components/note/all-notes.vue';
import SearchPanel from '@/components/common/search-panel.vue';
import { type NoteCardType } from '@/common/types';
import { list, listMap } from '@/common/constant';

const tagPageNum: Record<string, number> = {
  'recommand': 0,
  'new': 0,
  'help': 0,
  'daily': 0,
  'outfits': 0,
  'all': 0
};

const tabId = ref(0)
const notes = ref<NoteCardType[]>([])

const getNotes = (tag: string, query = '') => {
  if (tagPageNum[tag] < 0) return
  const remove = useLoading();
  return getExploreNotes({
    category: tag,
    page_num: tagPageNum[tag],
    question: encodeURIComponent(query)
  })
    .then(res => {
      tagPageNum[tag] ? notes.value.push(...res.notes) : (notes.value = res.notes)

      ++tagPageNum[tag]
      if (!res.notes.length) {
        // 说明后端没有数据了，则不用再次请求
        tagPageNum[tag] = -1
      }
    })
    .finally(() => {
      remove()
    })
}

watch(tabId, () => {
  notes.value = [];
  const tag = listMap[list[tabId.value]];
  tagPageNum[tag] = 0
  getNotes(tag)
}, {
  immediate: true
})

let lastSearch = ''
const handlerSearch = (searchCon: string) => {
  if (lastSearch === searchCon) return
  tagPageNum.all = 0 // 重置，后续搜索需要用，每次搜索内容都不一致
  getNotes('all', searchCon)?.then(res => {
    lastSearch = searchCon
  })
}

const recKey = 'explore-search-record-list'
</script>

<template>
  <search-panel :rec-key="recKey" @search="handlerSearch" tips="搜索笔记" />
  <sticky-list :list="list" @click="(id: number) => tabId = id" class="pt-120" />
  <all-notes :show-infos="notes" @req-notes="getNotes(listMap[list[tabId]])" />
  <bottom-menu />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.pt-120 {
  padding-top: responsive(120, vw);
}
</style>
