<script setup lang="ts">
import { getUserInfo } from '@/common/ts/user-info';
import { useNotityCountStore } from '@/store';
import { computed } from 'vue';

const userInfo = getUserInfo()
const selfTo = userInfo?.id ? `/user/${userInfo.id}` : '/login';

const notifyCnt = useNotityCountStore()
const interactionCnt = computed(() => notifyCnt.count > 99 ? `x99` : `x${notifyCnt.count}`)
const chatCnt = computed(() => notifyCnt.count > 99 ? `x99` : `x${notifyCnt.count}`)
</script>

<template>
    <div class="menu">
        <router-link to="/explore">探索</router-link>
        <router-link to="/publish">发布</router-link>
        <router-link to="/notification">
            互动<i class="count" v-html="interactionCnt" v-if="notifyCnt.count" />
        </router-link>
        <router-link to="/chat">
            消息<i class="count" v-html="chatCnt" v-if="notifyCnt.count" />
        </router-link>
        <router-link :to="selfTo">个人</router-link>
    </div>
</template>

<style lang="scss" scoped>
@import '../../common/style/func.scss';

.menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: responsive(70, vh);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #000;

    a {
        position: relative;
        text-decoration: none;
        color: hsla(0, 0%, 100%, 0.6);
    }

    ::v-deep(.router-link-active) {
        color: #fff
    }
}

.count {
    position: absolute;
    background-color: brown;
    border-radius: 50%;
    padding: responsive(5, vw) responsive(12, vw);
    top: responsive(-20, vw);
    right: responsive(-40, vw);
    font-size: 12px;
}
</style>
