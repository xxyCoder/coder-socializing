<script setup lang="ts">
import { defineProps } from 'vue';
import { noteLikeOrCollect } from '@/api/note';
import { useIsAndCnt } from '@/common/ts/use-is-cnt';
import { useToast } from '../Toast';

const props = defineProps({
  isLike: {
    type: Boolean,
    default: false
  },
  noteId: {
    type: [String, Number],
    required: true
  },
  likeCnt: {
    type: Number,
    default: 0
  },
  authorId: {
    type: [String, Number],
    required: true
  }
})

let isReq = false
const { is, cnt, change } = useIsAndCnt({ _is: props.isLike, _cnt: props.likeCnt })
const handlerLike = () => {
  if (isReq) return
  isReq = true
  noteLikeOrCollect({ is_like: !is.value, noteId: props.noteId, type: 'like', authorId: props.authorId })
    .then(change)
    .catch(err => {
      useToast(err.message)
    })
    .finally(() => isReq = false)
};
</script>

<template>
  <span @click.stop="handlerLike" class="center mt-5">
    <svg v-if="is" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="red">
      <path
        d="M12 21.35c-0.36 0.21-0.77 0.35-1.2 0.35s-0.84-0.14-1.2-0.35C4.71 14.25 2 11.45 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 2.95-3.4 5.75-8.55 11.54z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25">
      <path stroke="white" stroke-width="1"
        d="M12 21.35c-0.36 0.21-0.77 0.35-1.2 0.35s-0.84-0.14-1.2-0.35C4.71 14.25 2 11.45 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 2.95-3.4 5.75-8.55 11.54z" />
    </svg>
    <span>{{ cnt }}</span>
  </span>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-5 {
  margin: 0 5px;
}
</style>../Toast