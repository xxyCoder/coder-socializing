<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router';
import { backendStatic, ip, port } from '@/api/config';
import like from '@/components/common/like.vue';

defineProps({
    posterSrc: String,
    title: String,
    author: String,
    avatarSrc: String,
    userId: [String, Number],
    noteId: [String, Number],
    isLike: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    isVideo: {
        type: Boolean,
        default: false
    }
});

const router = useRouter();
</script>

<template>
    <div class="note-card-wrapper">
        <div class="note-intro" @click="router.push(`/explore/${noteId}`)">
            <video v-if="isVideo" :src="posterSrc"></video>
            <img v-else :src="posterSrc || `${ip}:${port}${backendStatic}/default.jpg`" />
            <span class="title">{{ title }}</span>
        </div>
        <div class="author-wrapper center" @click="router.push(`/user/${userId}`)">
            <div class="author center">
                <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
                <span>{{ author }}</span>
            </div>
            <like :is-like="isLike" :like-cnt="likes" :note-id="noteId!" :author-id="userId!" class="center" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.note-card-wrapper {
    margin: responsive(20, vh);
    max-width: responsive(300, vw);
}

.note-intro {
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: responsive(300, vw);

    img,
    video {
        display: block;
        margin-bottom: 5px;
        width: 100%;
        border-radius: responsive(15, vh);
    }
}

.title {
    margin: responsive(5, vh) 0;
}

.center {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.author-wrapper {
    margin-top: responsive(10, vw);
    color: hsla(0, 0%, 100%, 0.8);
    font-size: 12px;
}

.author {
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;

    img {
        margin-right: 5px;
        height: responsive(30, vh);
        width: responsive(30, vh);
        border-radius: 50%;
    }

    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.fx-1 {
    flex: 1;
}
</style>
