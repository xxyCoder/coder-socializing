<script setup lang="ts">
import { MessageTag } from '@/common/constant';
import { useNotityCountStore } from '@/store';
import { PropType, computed, defineProps, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  item: {
    type: Object as PropType<{ name: string, tag: MessageTag }>,
    default() {
      return { name: '', tag: '' }
    }
  }
})

const notify = useNotityCountStore()
const listCntMap: Record<MessageTag, string> = {
  [MessageTag['comment-follow']]: 'commetAndFollowCnt',
  [MessageTag['like-collect']]: 'likeAndCollectCnt',
  [MessageTag.chat]: 'chatCnt',
  [MessageTag['self-comment']]: 'self-comment'
}

// @ts-ignore
const count = computed<number>(() => notify[listCntMap[props.item.tag]])

const router = useRouter()
function viewNotifyDetail() {
  router.push({ path: '/message', query: { tag: props.item.tag } })
}
const cntTxt = computed(() => count.value < 100 ? `${count.value}` : `x99`)
</script>

<template>
  <div class="btn" @click="viewNotifyDetail">
    {{ item.name }}
    <span class="cnt" v-show="count">{{ cntTxt }}</span>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.btn {
  box-sizing: border-box;
  position: relative;
  padding: responsive(20, vw);
  border-radius: responsive(10, vw);
  box-shadow: 0 0 responsive(20, vw) rgb(166 159 159 / 80%);
}

.cnt {
  position: absolute;
  right: responsive(-10, vw);
  top: responsive(-20, vw);
  color: #fff;
  background-color: rgb(249, 60, 60);
  border-radius: 50%;
  padding: responsive(10, vw);
  font-size: 12px;
}
</style>