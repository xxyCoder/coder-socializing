<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { getExploreNotes, getRecommentNote } from '@/api/note'
import { useLoading } from '@/components/Loading';
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import AllNotes from '@/components/note/all-notes.vue';
import { type NoteCardType } from '@/common/types';
import { useRouter } from 'vue-router';

const list = ['新鲜', '学习', '游戏', '互助', '美食'];
const listMap: Record<string, string> = { '新鲜': 'new', '学习': 'learn', '游戏': 'game', '互助': 'help', '美食': 'food' };
const tagPageNum: Record<string, number> = {
  'new': 0,
  'learn': 0,
  'game': 0,
  'help': 0,
  'food': 0,
  'all': 0
};

const router = useRouter()

const tabId = ref(0)
const notes = ref<NoteCardType[]>([])
const searchCon = ref('')

const getNotes = (tag: string) => {
  if (tagPageNum[tag] < 0) return
  const remove = useLoading();
  getExploreNotes({
    category: tag,
    page_num: tagPageNum[tag],
    question: encodeURIComponent(searchCon.value)
  })
    .then(res => {
      if (res.notes.length) {
        tagPageNum[tag] ? notes.value.push(...res.notes) : (notes.value = res.notes)
      }

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

const recommendList = ref<Array<{ id: number, title: string }>>([])
getRecommentNote()
  .then(res => {
    recommendList.value = res.notes
  })

const isActive = ref(false)
const recKey = 'explore-search-record-list'
const recList = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem(recKey) || '[]')))

const showPanel = computed(() => isActive.value && (recList.value.size || recommendList.value.length))
const clearRec = () => {
  localStorage.removeItem(recKey)
  recList.value.clear()
}
let lastSearch = ''
const search = () => {
  if (searchCon.value === lastSearch) {
    return
  }
  tagPageNum.all = 0 // 重置，后续搜索需要用，每次搜索内容都不一致
  getNotes('all')
  if (searchCon.value) {
    recList.value.add(searchCon.value)
    localStorage.setItem(recKey, JSON.stringify([...recList.value.values()]))
  }
  lastSearch = searchCon.value
  searchCon.value = ''
}

const quickSearch = (rec: string) => {
  searchCon.value = rec
  search()
}

const fn = () => {
  isActive.value = false
}
document.addEventListener('click', () => {
  fn()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', fn)
})
</script>

<template>
  <div class="search-panel">
    <div class="search">
      <input type="text" v-model="searchCon" @click.stop="isActive = true" />
      <button @click="search">搜索</button>
    </div>
    <div class="panel" v-show="showPanel">
      <div v-if="recList.size" class="title">
        <h5>历史记录</h5>
        <span @click.stop="clearRec">清空</span>
      </div>
      <div class="list">
        <div class="rec" v-for="rec in recList.values()" :key="rec" @click="quickSearch(rec)">{{ rec }}</div>
      </div>
      <h5 v-if="recommendList.length" class="title">推荐阅读</h5>
      <div class="recommend-list">
        <div class="recommend" v-for="(item, i) in recommendList" :key="item.id"
          @click="router.push(`/explore/${item.id}`)">
          <i>{{ i + 1 }}.</i><span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
  <sticky-list :list="list" @click="(id: number) => tabId = id" class="pt-120" />
  <all-notes :show-infos="notes" @req-notes="getNotes(listMap[list[tabId]])" />
  <bottom-menu />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.search-panel {
  position: fixed;
  width: 100vw;
  box-sizing: border-box;
  padding: responsive(20, vw);
  background-color: #000;
  z-index: 2;
}

.panel {
  position: absolute;
  width: 70%;
  margin-top: responsive(10, vw);
  background-color: #242526;
  border-radius: responsive(20, vw);
  padding: responsive(20, vw);
}

.title {
  display: flex;
  justify-content: space-between;
  margin-bottom: responsive(16, vw);
  margin-top: 0;

  h5 {
    margin: 0;
  }

  span {
    font-size: 14px;
    color: #ccc;
  }
}

.search {
  display: flex;

  input {
    flex: 1;
    background-color: #242526;
    outline: none;
    border: none;
    border-radius: responsive(12, vw);
    padding: responsive(6, vw);
    color: #fff;
  }

  button {
    padding: responsive(12, vw) responsive(32, vw);
    border-radius: responsive(12, vw);
    border: none;
    margin-left: responsive(20, vw);
    background-color: #1e80ff;
    color: #fff;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
}

.rec {
  padding: responsive(6, vw) responsive(16, vw);
  box-sizing: border-box;
  border-radius: responsive(12, vw);
  background-color: #e0d8d84b;
  margin-right: responsive(10, vw);
  margin-bottom: responsive(10, vw);
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pt-120 {
  padding-top: responsive(120, vw);
}

.recommend {
  margin-bottom: responsive(5, vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  i {
    margin-right: responsive(10, vw);
    font-size: 12px;
  }
}
</style>
