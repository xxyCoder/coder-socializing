<script setup lang="ts">
import { backendStatic, ip, port } from '@/api/constant'
import { defineProps, defineEmits, PropType, computed } from 'vue'
import { Comment, ReplyInfo } from '@/common/types';

const props = defineProps({
    replyComments: {
        type: Array as PropType<Comment[]>,
        default() {
            return []
        }
    },
    commentId: {
        type: Number,
        required: true
    },
    avatarSrc: {
        type: String
    },
    userId: {
        type: Number,
        required: true
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
    },
    replyCnt: {
        type: Number,
        default: 0
    }
})

const remainCnt = computed(() => Math.max(0, props.replyCnt - props.replyComments.length))

const emits = defineEmits<{
    reply: [ReplyInfo],
    extend: [number]
}>()
const handlerReply = (info: ReplyInfo) => {
    emits('reply', info)
}
const extendRemain = (rootCommentId: number) => {
    emits('extend', rootCommentId)
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
                <span
                    @click="handlerReply({ targetCommentId: commentId, username: username, comment: content, rootCommentId: commentId, replyUserId: userId })"
                    class="reply" v-html="'回复'" />
            </div>
        </div>
    </div>
    <div class="comment-item ml-10" v-for="item in replyComments" :key="item.id">
        <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
        <div class="user-info">
            <div class="author">
                <router-link :to="`/user/${item.user.userId}`">{{ item.user.username }}</router-link>
                <span v-if="item.replyUsername">回复{{ item.replyUsername }}</span>
            </div>
            <p class="content">{{ item.content }}</p>
            <div class="text-12px">
                <span class="date">{{ new Date(item.createdAt).toDateString() }}</span>
                <span
                    @click="handlerReply({ targetCommentId: item.id, username: item.user.username, comment: item.content, rootCommentId: commentId, replyUserId: item.user.userId })"
                    class="reply" v-html="'回复'" />
            </div>
        </div>
    </div>
    <div v-show="remainCnt" class="show-more" @click="extendRemain(commentId)">
        展开剩余{{ remainCnt }}回复
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.ml-10 {
    margin-left: responsive(100, vw);
}


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

.show-more {
    margin-left: responsive(180, vw);
    margin-bottom: responsive(20, vw);
    color: #c7daef;
    font-size: 14px;
}
</style>
