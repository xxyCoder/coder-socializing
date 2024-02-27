<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router';
import { backendStatic, ip, port } from '@/api/config';
import like from '@/components/like.vue';

defineProps({
    posterSrc: String,
    title: String,
    author: String,
    avatarSrc: String,
    userId: [String, Number],
    noteId: [String, Number],
    likes: {
        type: Number,
        default: 0
    },
    isVideo: {
        type: Boolean,
        default: false
    }
});

const isLike = ref(true) // 能出现在喜欢列表的都是true，只有点击之后才会不喜欢

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
            <like :is-like="isLike" :note-id="noteId!" class="center"/>
        </div>
    </div>
</template>

<style lang="scss">
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
    margin-top: 5px;
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
