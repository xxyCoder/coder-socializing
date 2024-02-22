<script setup lang="ts">
import { getUserInfo } from '@/common/ts/user-info';

const userInfo = getUserInfo()
const selfTo = userInfo?.id ? `/user/${userInfo.id}` : '/login';
</script>

<template>
    <div class="menu">
        <router-link to="/explore">探索</router-link>
        <router-link to="/publish">发布</router-link>
        <router-link to="/notification">通知</router-link>
        <router-link :to="selfTo">个人</router-link>
    </div>
</template>

<style lang="scss" scoped>
@import '../common/style/func.scss';

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

    a {
        text-decoration: none;
        color: hsla(0, 0%, 100%, 0.6);
    }

    ::v-deep(.router-link-active) {
        color: #fff
    }
}
</style>
