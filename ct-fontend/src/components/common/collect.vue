<script setup lang="ts">
import { noteLikeOrCollect } from '@/api/note';
import { defineProps } from 'vue'
import { useToast } from '../Toast';
import { useIsAndCnt } from '@/common/ts/use-is-cnt';

const props = defineProps({
    isCollect: {
        type: Boolean,
        default: false
    },
    collectCnt: {
        type: Number,
        default: 0
    },
    noteId: {
        type: [Number, String],
        required: true
    },
    authorId: {
        type: Number,
        required: true
    }
})

const { is, cnt, change } = useIsAndCnt({ _is: props.isCollect, _cnt: props.collectCnt })
let isReq = false
const handlerCollect = () => {
    console.log(isReq)
    if (isReq) return
    isReq = true
    noteLikeOrCollect({ is_collect: !is.value, noteId: props.noteId, type: 'collect', authorId: props.authorId })
        .then(change)
        .catch(err => {
            useToast(err.message)
        })
        .finally(() => isReq = false)
}
</script>

<template>
    <span class="mt-5 center" @click="handlerCollect">
        <svg v-if="is" class="mt-5" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,0 13.1,6.2 20,7.7 15.2,12.3 16.2,20 10,16 3.8,20 4.8,12.3 0,7.7 6.9,6.2"
                fill="yellow" />
        </svg>
        <svg v-else class="mt-5" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,0 13.1,6.2 20,7.7 15.2,12.3 16.2,20 10,16 3.8,20 4.8,12.3 0,7.7 6.9,6.2"
                stroke="#ffffff" stroke-width="1" />
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
    margin: 0 5px
}
</style>
../Toast