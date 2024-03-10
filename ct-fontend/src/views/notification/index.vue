<script setup lang="ts">
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';

const list = ['评论和@', '关注', '点赞', '私信']
</script>

<template>
    <sticky-list :list="list" />
    <div class="container"></div>
    <BottomMenu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';

</style>