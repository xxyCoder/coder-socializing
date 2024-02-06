<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pageSize, tabName } from './ts/index';
import { ip, port, backendStatic } from '@/api/config';
import { getViewerInfo } from '@/api/users';
import { getViewerNote } from '@/api/note'
import { follwerOrCancel } from '@/api/index'
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import type { NoteCardType } from '@/common/types'
import BottomMenu from '@/components/bottom-menu.vue';
import StickyList from '@/components/sticky-list.vue';
import NoteCard from '@/components/note/note-card.vue';
import NullData from '@/components/null-data.vue';

const route = useRoute();
const router = useRouter()
const selfInfo = getUserInfo();

const { id: viewerId } = route.params;
let notePageNum = 0, likePageNum = 0;

const userExists = ref(true)
const userInfo = reactive({ username: "", avatarSrc: "", intro: "这个人没有个人介绍", isFollwer: false });
const notes: NoteCardType[] = [], likes: NoteCardType[] = [];
const showInfos = ref<NoteCardType[]>([]);
const remove = useLoading()
getViewerInfo(`?viewer_id=${viewerId}&page_num=${notePageNum}&page_size=${pageSize}&category=${tabName[0]}`)
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        remove();
        ++notePageNum;
        if (res.data) {
            const { notes: _notes, avatarSrc, username, intro, isFollwer } = res.data;
            notes.push(..._notes);
            showInfos.value = notes;
            userInfo.avatarSrc = avatarSrc
            userInfo.intro = intro
            userInfo.username = username
            userInfo.isFollwer = isFollwer
        }
    })
    .catch(err => {
        remove();
        useToast(err.message)
        userExists.value = false;
    })

const userStateMap = {
    self: '修改信息',
    follwer: '已关注',
    other: '关注'
};
const userState = computed(() => {
    if (Number(viewerId) === selfInfo?.id) return 'self'
    return userInfo.isFollwer ? 'follwer' : 'other';
});
const handlerClick = () => {
    if (!selfInfo || !selfInfo.id) return;
    switch (userState.value) {
        case 'self': router.push('/user-info'); break;
        case 'follwer':
        case 'other':
            follwerOrCancel({ id: String(selfInfo.id), viewer_id: viewerId as string, is_follwer: String(userInfo.isFollwer) })
                .then(res => {
                    if (res.code !== 200) throw new Error(res.msg);
                    userInfo.isFollwer = !userInfo.isFollwer;
                })
                .catch(err => {
                    useToast(err.message);
                })
            break;
    }
};

const list = ['笔记', '点赞'];
const reqListData = (idx: number) => {
    let query = ''
    switch (idx) {
        case 0:
            query = `page_num=${notePageNum}`;
            ++notePageNum;
            break;
        case 1:
            query = `page_num=${likePageNum}`;
            ++likePageNum;
            break
    }
    const remove = useLoading()
    showInfos.value = []
    getViewerNote(`?viewer_id=${viewerId}&${query}&page_size=${pageSize}&category=${tabName[idx]}`)
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg);
            res.data && (idx ? likes.push(...res.data.notes) : notes.push(...res.data.notes))
        })
        .catch(err => {
            useToast(err.message)
        })
        .finally(() => {
            remove()
            showInfos.value = idx ? likes : notes;
        })
}
</script>

<template>
    <div v-if="userExists" class="container">
        <div class="info center">
            <div class="center">
                <img :src="userInfo.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
                <div class="info-right">
                    <div>{{ userInfo.username }}</div>
                    <span>ct号：{{ viewerId }}</span>
                </div>
            </div>
            <button class="user-state" @click="handlerClick">{{ userStateMap[userState] }}</button>
        </div>
        <p class="intro">{{ userInfo.intro || '这个人没有个人介绍' }}</p>
        <div class="user-interactions"></div>
    </div>
    <StickyList :list="list" @click="reqListData" />
    <div class="note-info">
        <NoteCard v-for="item in showInfos" :key="item.id" :author="item.username" :title="item.title" :note-id="item.id"
            :user-id="item.userId" :poster-src="item.posterSrc" :avatar-src="item.avatarSrc" :is-video="item.isVideo" />
        <NullData style="margin-top: 50px;" v-if="!showInfos.length" />
    </div>
    <BottomMenu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
@import '../../common/style/func.scss';

.center {
    display: flex;
    align-items: center;
}

.info {
    justify-content: space-between;

    img {
        height: 4.5rem;
        width: 4.5rem;
        border-radius: 50%;
    }

    .info-right {
        margin-left: 16px;

        div {
            font-size: 18px;
        }

        span {
            font-size: 12px;
            color: hsla(0, 0%, 100%, 0.6);
        }
    }
}

.intro {
    font-size: 14px;
    white-space: pre-line;
}

.user-state {
    border: 1px solid #1e80ff;
    border-radius: 5px;
    padding: responsive(8, vh) responsive(20, vh);
    background-color: transparent;
    color: #fff;
}

.note-info {
    display: flex;
    flex-wrap: wrap;
}
</style>
