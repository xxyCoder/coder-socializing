<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNoteDetail } from '@/api/note'
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';
import { follwerOrCancel } from '@/api';
import { getUserInfo } from '@/common/ts/user-info';
import NullData from '@/components/null-data.vue';
import Carousel from '@/components/carousel.vue';
import { UserInfo, NoteInfo } from '@/common/types/index'
import { backendStatic, ip, port } from '@/api/config';
import Like from '@/components/like.vue';

const route = useRoute();
const router = useRouter();
const { id } = route.params;

const selfInfo = getUserInfo()
const note = ref<NoteInfo>()
const viewr = ref<UserInfo>()
const isLike = ref(false)
const likeCnt = ref(0)

const remove = useLoading();
getNoteDetail(`?noteId=${id}`)
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        remove();
        note.value = res.data?.note
        isLike.value = note.value?.isLike || false
        likeCnt.value = note.value?.likeCnt || 0
        viewr.value = res.data?.user
    })
    .catch(err => {
        remove();
        useToast(err.message);
    });

const handlerClick = () => {
    if (!selfInfo || !selfInfo.id) {
        useToast('请先登录~');
        return
    }

    if (!viewr.value) {
        useToast('出错了~');
        return;
    }

    follwerOrCancel({ id: String(selfInfo.id), viewer_id: String(viewr.value.userId), is_follwer: String(viewr.value.isFollower) })
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg);
            viewr.value && (viewr.value.isFollower = !viewr.value.isFollower);
        })
        .catch(err => {
            useToast(err.message);
        })
}

const comment = ref<string>('')
const handlerLike = () => {
    isLike.value = !isLike.value;
    isLike.value ? ++likeCnt.value : --likeCnt.value;
}
</script>

<template>
    <template v-if="note && viewr">
        <header class="author-wrapper">
            <div class="author-info">
                <span class="close" @click="router.back">+</span>
                <img :src="viewr.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="avatar">
                <span>{{ viewr.username }}</span>
            </div>
            <button class="follower-btn" @click="handlerClick">{{ viewr.isFollower ? '取消关注' : '关注' }}</button>
        </header>
        <div class="note-page container">
            <div class="media-box">
                <video v-if="note.isVideo" :src="note.mediaList"></video>
                <carousel v-else :list="note.mediaList.split(';')" />
            </div>
            <div>
                <h3 class="title">{{ note.title }}</h3>
                <p class="content">{{ note.content }}</p>
                <span class="time">
                    {{ (note.updateDate === note.createDate ? '发布于' : '编辑于') + ' ' +
                        new Date(note.updateDate).toLocaleString() }}
                </span>
            </div>
            <div class="comments">

            </div>
        </div>
        <div class="interaction">
            <input class="comment" v-model="comment" type="text" placeholder="评论" />
            <like :is-like="isLike" :likes="likeCnt" :note-id="note.id" @like="handlerLike" />
        </div>
    </template>
    <null-data v-else />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';
@import '../../common/style/global.scss';

.author-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1.25rem;
    position: sticky;
    top: 0;
    z-index: 1;
}

.author-info {
    display: flex;
    align-items: center;

    img {
        width: responsive(60, vw);
        height: responsive(60, vw);
        border-radius: 50%;
        margin: 0 5px;
    }
}

.close {
    display: inline-block;
    font-size: responsive(80, vw);
    font-weight: 100;
    transform: rotateZ(45deg);
    color: hsla(0, 0%, 100%, 0.8);
}

.follower-btn {
    border: none;
    border-radius: responsive(40, vw);
    padding: responsive(12, vh) responsive(40, vw);
    background-color: #1e80ff;
    color: #fff;
}

.media-box {
    video {
        width: 100%;
    }
}

.content {
    font-size: 14px;
}

.time {
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 12px;
}

.interaction {
    position: fixed;
    box-sizing: border-box;
    padding: responsive(12, vh) responsive(24, vw);
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    display: flex;
    align-items: center;
}

.comment {
    border: none;
    padding: responsive(12, vh) responsive(24, vw);
    border-radius: responsive(12, vh);
    color: hsla(0, 0%, 100%, 0.6);
    background-color: hsla(0, 0%, 100%, 0.04);
    outline: none;
}
</style>
