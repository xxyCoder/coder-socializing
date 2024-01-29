<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pageSize, tabName } from './ts/index';
import { ip, port, backendStatic } from '@/api/config';
import { getViewerInfo } from '@/api/users';
import { follwerOrCancel } from '@/api/concern'
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import type { NoteCardType } from '@/common/types'
import NoteCard from '@/components/note-card.vue';

const route = useRoute();
const router = useRouter()
const selfInfo = getUserInfo();

const { id: viewerId } = route.params;
const tabId = ref(0)
let notePageNum = 0, likePageNum = 0;

const userExists = ref(true)
const userInfo = reactive({ username: "", avatarSrc: "", intro: "这个人没有个人介绍", isFollwer: false });
const notes = ref<NoteCardType[]>([]), likes = ref<NoteCardType[]>([]);
const remove = useLoading()
getViewerInfo(`?viewer_id=${viewerId}&page_num=${notePageNum}&page_size=${pageSize}&category=${tabName[tabId.value]}`)
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        remove();
        ++notePageNum;
        if (res.data) {
            const { notes: _notes, avatarSrc, username, intro, isFollwer } = res.data;
            notes.value.push(..._notes);
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
        <NoteCard title="虽然但是，她给的真的好多！" author="xxyCoder" :likes="666"/>
    </div>
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
</style>
