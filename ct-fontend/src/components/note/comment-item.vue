<script setup lang="ts">
import { backendStatic, ip, port } from '@/api/config'
import { defineProps, defineEmits } from 'vue'
import { ReplyInfo } from '@/common/types';

const props = defineProps({
    isReply: {
        type: Boolean,
        default: false
    },
    commentId: {
        type: Number,
        required: true
    },
    avatarSrc: {
        type: String
    },
    userId: {
        type: Number
    },
    username: {
        type: String,
        default: ''
    },
    date: {
        type: String
    },
    content: {
        type: String,
        default: ''
    },
    commentCnt: {
        type: Number,
        default: 0
    }
})

const emits = defineEmits<{
    reply: [ReplyInfo]
}>()
const handlerReply = (e: MouseEvent) => {
    emits('reply', { targetCommentId: props.commentId, username: props.username, comment: props.content })
}
</script>

<template>
    <div class="comment-item">
        <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
        <div class="user-info">
            <div class="author">
                <router-link :to="`/user/${userId}`">{{ username }}</router-link>
            </div>
            <p class="content">{{ content }}</p>
            <div class="text-12px">
                <span class="date">{{ date }}</span>
                <span @click="handlerReply" class="reply">回复（{{ commentCnt }}）</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';


.comment-item {
    display: flex;
    font-size: 14px;
    margin-bottom: 10px;

    img {
        width: responsive(70, vw);
        height: responsive(70, vw);
        border-radius: 50%;
        margin-right: responsive(20, vw);
    }
}

.author {
    a {
        color: hsla(0, 0%, 100%, 0.6);
    }
}

.content {
    margin: 0;
}

.text-12px {
    font-size: 12px;
}

.date {
    color: hsla(0, 0%, 100%, 0.6);
    margin-right: responsive(20, vw);
}

.reply {
    color: hsla(0, 0%, 100%, 0.8);
}
</style>
