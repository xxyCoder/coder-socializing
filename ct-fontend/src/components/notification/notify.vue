<script setup lang="ts">
import { defineProps, reactive, ref, watchEffect } from 'vue';
import NotifyItem from './notify-item.vue';
import nullData from '@/components/common/null-data.vue';
import { getNotifyList } from '@/api/notify';
import { Notify } from '@/common/types/notify';
import { useNotityCountStore } from '@/store';

const props = defineProps({
    type: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
})

const notifyList = reactive<Array<Notify[]>>([])
for (let i = 0; i < props.total; ++i) notifyList[i] = []

const pageNumArr = new Array(props.total).fill(0)
watchEffect(() => {
    const { type } = props
    getNotifyList(`?type=${type}&page_num=${pageNumArr[type]}`)
        .then(res => {
            notifyList[type].push(...res)
        })
        .catch(() => {
            // 
        })
})
const { clearCount } = useNotityCountStore()
clearCount()
</script>

<template>
    <notify-item v-for="item in notifyList[type]" :key="item.id" :notify-id="item.id" :user-id="item.userId"
        :username="item.username" :avatar-src="item.avatarSrc" :note-id="item.noteId" :title="item.title"
        :comment-id="item.commentId" :reply-comment-id="item.replyCommentId" :content="item.content"
        :reply-content="item.replyContent" :time="item.time" :status="item.status" :type="item.type"
        :root-comment-id="item.rootCommentId" />
    <null-data v-if="!notifyList.length" />
</template>
