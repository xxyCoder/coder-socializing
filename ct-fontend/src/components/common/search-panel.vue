<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { getRecommentNote } from '@/api/note';

const props = defineProps({
  recKey: {
    type: String,
    default: ''
  },
  tips: {
    type: String,
    default: '搜索'
  }
})

const isActive = ref(false)
const fn = () => {
  isActive.value = false
}
document.addEventListener('click', () => {
  fn()
})

const recommendList = ref<Array<{ id: number, title: string }>>([])
getRecommentNote()
  .then(res => {
    recommendList.value = res.notes
  })

const recList = ref<Set<string>>(new Set(JSON.parse(localStorage.getItem(props.recKey) || '[]')))
const clearRec = () => {
  localStorage.removeItem(props.recKey)
  recList.value.clear()
}
const showPanel = computed(() => isActive.value && (recList.value.size || recommendList.value.length))

const searchCon = ref('')
const emits = defineEmits(['search'])

const search = () => {
  emits('search', searchCon.value)
  if (searchCon.value) {
    recList.value.add(searchCon.value)
    localStorage.setItem(props.recKey, JSON.stringify([...recList.value.values()]))
  }
  searchCon.value = ''
}
const quickSearch = (rec: string) => {
  searchCon.value = rec
  search()
}

const router = useRouter()


onBeforeUnmount(() => {
  document.removeEventListener('click', fn)
})
</script>

<template>
  <div class="search-panel">
    <div class="search">
      <input type="text" v-model="searchCon" @click.stop="isActive = true" :placeholder="tips" />
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