<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { NotifyTypeMap } from './notify';
import { useCommentAndAtNotifyStore } from '@/store';
import NotifyItem from './notify-item.vue';

const props = defineProps({
    type: {
        type: Number,
        default: 0
    }
})

const notifyList = computed(() => {
    switch (props.type) {
        case NotifyTypeMap['comment-at']:
            return useCommentAndAtNotifyStore().commentAtNofityList
        case NotifyTypeMap.concern:
            break;
        case NotifyTypeMap['thumb-collect']:
            break
    }
    return []
})
</script>

<template>
    <notify-item v-for="item in notifyList" :key="item.id" :notify-id="item.id" :user-id="item.userId"
        :username="item.username" :avatar-src="item.avatarSrc" :note-id="item.noteId" :title="item.title"
        :comment-id="item.commentId" :reply-comment-id="item.replyCommentId" :content="item.content"
        :reply-content="item.replyContent" :time="item.time" :status="item.status" :type="item.tinyType" />
</template>
