<script setup lang="ts">
import { noteLikeOrCollect } from '@/api/note';
import { defineProps, defineEmits } from 'vue'
import { useToast } from '../Toast';

const props = defineProps({
    isCollect: {
        type: Boolean,
        default: false
    },
    collectCnt: {
        type: [Number, String],
        default: 0
    },
    noteId: {
        type: [Number, String],
        required: true
    }
})

const emits = defineEmits(['collect'])

const handlerCollect = () => {
    noteLikeOrCollect({ is_collect: String(!props.isCollect), noteId: String(props.noteId), type: 'collect' })
        .then(() => {
            emits('collect')
        })
        .catch(err => {
            useToast(err.message)
        })
}
</script>

<template>
    <span class="mt-5 center" @click="handlerCollect">
        <svg v-if="isCollect" class="mt-5" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,0 13.1,6.2 20,7.7 15.2,12.3 16.2,20 10,16 3.8,20 4.8,12.3 0,7.7 6.9,6.2"
                fill="yellow" />
        </svg>
        <svg v-else class="mt-5" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,0 13.1,6.2 20,7.7 15.2,12.3 16.2,20 10,16 3.8,20 4.8,12.3 0,7.7 6.9,6.2"
                stroke="#ffffff" stroke-width="1" />
        </svg>
        <span>{{ collectCnt }}</span>
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