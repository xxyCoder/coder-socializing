<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { backendStatic, ip, port } from '@/api/config';
import { noteLike } from '@/api';
import { useToast } from '../Toast';
import { useRouter } from 'vue-router';

const props = defineProps({
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
const handlerLike = () => {
    noteLike({ is_like: String(isLike.value), noteId: String(props.noteId) })
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg)
            isLike.value = !isLike.value
        })
        .catch(err => {
            useToast(err.message)
        })
};

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
            <span @click="handlerLike" class="count center">
                <svg v-if="isLike" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25" fill="red">
                    <path
                        d="M12 21.35c-0.36 0.21-0.77 0.35-1.2 0.35s-0.84-0.14-1.2-0.35C4.71 14.25 2 11.45 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 2.95-3.4 5.75-8.55 11.54z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25">
                    <path fill="none" stroke="white" stroke-width="1"
                        d="M12 21.35c-0.36 0.21-0.77 0.35-1.2 0.35s-0.84-0.14-1.2-0.35C4.71 14.25 2 11.45 2 8.5 2 5.42 4.42 3 7.5 3 9.24 3 10.91 3.81 12 5.09 13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 2.95-3.4 5.75-8.55 11.54z" />
                </svg>
                <span>{{ likes }}</span>
            </span>
        </div>
    </div>
</template>

<style lang="scss">
@import '../../common/style/func.scss';

.note-card-wrapper {
    margin: responsive(20, vh);
    width: fit-content;
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

.count {
    svg {
        color: #fff;
    }
}
</style>
