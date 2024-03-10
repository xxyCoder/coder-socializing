<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { backendStatic, ip, port } from '@/api/config';
import { NotifyItemTypeMap } from './notify';
import { useRouter } from 'vue-router';
import { useNoteInfoStore } from '@/store';

const props = defineProps({
    avatarSrc: {
        type: String
    },
    userId: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        default: '匿名'
    },
    noteId: {
        type: Number,
        default: 0
    },
    commentId: {
        type: Number
    },
    replyCommentId: {
        type: Number
    },
    title: {
        type: String,
        default: ''
    },
    time: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
    replyContent: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
    },
    type: {
        type: Number
    }
})

const tips = computed(() => {
    const { type, title, replyCommentId } = props
    switch (type) {
        case NotifyItemTypeMap.comment:
            return `在《${title}》中${replyCommentId ? '回复' : '评论'}了你`
        case NotifyItemTypeMap.at:
            return `在《${title}》中@了你`
        case NotifyItemTypeMap.collect:
            return `收藏了你的笔记《${title}》`
        case NotifyItemTypeMap.concern:
            return '关注了你'
        case NotifyItemTypeMap.thumb:
            return `给你的笔记《${title}》点赞`
        default:
            return ''
    }
})

const date = computed(() => {
    const cur = new Date(), last = new Date(props.time)
    if (cur.getFullYear() > last.getFullYear()) {
        return `${cur.getFullYear() - last.getFullYear()}年前`
    } else if (cur.getMonth() > last.getMonth()) {
        return `${cur.getMonth() - last.getMonth()}月前`
    } else if (cur.getDate() > last.getDate()) {
        return `${cur.getDate() - last.getDate()}日前`
    } else if (cur.getHours() > last.getHours()) {
        return `${cur.getHours() - last.getHours()}小时前`
    } else if (cur.getMinutes() > last.getMinutes()) {
        return `${cur.getMinutes() - last.getMinutes()}分钟前`
    } else {
        return `${cur.getSeconds() - last.getSeconds()}秒前`
    }
})

const router = useRouter()
const handlerClick = () => {
    const { type, replyCommentId, noteId, commentId } = props
    const { setNoteInfo } = useNoteInfoStore()
    switch (type) {
        case NotifyItemTypeMap.comment:
            setNoteInfo({ replyCommentId: replyCommentId!, commentId: commentId! })
            router.push(`/explore/${noteId}`)
            break
        case NotifyItemTypeMap.at:
            break
        case NotifyItemTypeMap.collect:
            break
        case NotifyItemTypeMap.concern:
            break
        case NotifyItemTypeMap.thumb:
            break
    }
}
</script>

<template>
    <div class="notify" @click="handlerClick">
        <div class="header">
            <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
            <router-link :to="'/user/' + userId">{{ username }}</router-link>
            <span>{{ tips }}</span>
        </div>
        <div class="container">
            <div class="content">
                <p>{{ content }}</p>
                <p class="reply">{{ replyContent }}</p>
                <span v-html="date" />
            </div>
            <i v-if="!status" class="red-dot" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.notify {
    box-sizing: border-box;
    padding: responsive(20, vw);
}

.header {
    display: flex;
    align-items: center;

    img {
        width: responsive(60, vw);
        height: responsive(60, vw);
        border-radius: 50%;
    }

    a {
        color: #fff;
        margin: 0 responsive(20, vw)
    }
}

.container {
    margin-left: responsive(80, vw);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.content {
    span {
        font-size: 12px;
    }

    p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: responsive(10, vw) 0
    }
}

.reply {
    position: relative;
    color: #8a919f;
    padding-left: responsive(20, vw);
}

.reply::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #c2c8d1;
}

span {
    color: #8a919f
}

.red-dot {
    width: responsive(15, vw);
    height: responsive(15, vw);
    background-color: red;
    border-radius: 50%;
}
</style>
