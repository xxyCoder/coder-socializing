<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { pageSize, tabName } from './ts/index';
import { getViewerInfo } from '@/api/users';
import { useLoading } from '@/components/Loading';
import type { NoteCardType } from '@/common/types'

const route = useRoute()

const { id: viewerId } = route.params;
const tabId = ref(0)
let notePageNum = 0, likePageNum = 0;
const userExists = ref(true)
const userInfo = reactive({ username: "", avatarSrc: "", intro: "这个人没有个人介绍" });
const notes = ref<NoteCardType[]>([]), likes = ref<NoteCardType[]>([]);
const remove = useLoading()
getViewerInfo(`?viewer_id=${viewerId}&page_num=${notePageNum}&page_size=${pageSize}&category=${tabName[tabId.value]}`)
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        remove();
        ++notePageNum;
        console.log(notes.value)
        if (res.data) {
            const { notes: _notes, avatarSrc, username, intro } = res.data;
            notes.value.push(..._notes);
            userInfo.avatarSrc = avatarSrc
            userInfo.intro = intro
            userInfo.username = username
        }
    })
    .catch(err => {
        remove();
        userExists.value = false;
    })
</script>

<template>
    <div v-if="userExists" class="container">
        <div class="info">
            <img :src="userInfo.avatarSrc || '@/assets/default.jpg'" alt="头像" />
            <div class="info-right">
                <div>{{ userInfo.username }}</div>
                <span>ct号：{{ viewerId }}</span>
            </div>
        </div>
        <p class="intro">{{ userInfo.intro || '这个人没有个人介绍' }}</p>
        <div class="user-interactions"></div>
    </div>
</template>

<style scoped lang="scss">
@import url('../../common/style/global.scss');

.info {
    display: flex;
    align-items: center;

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
</style>
