<script setup lang="ts">
import { defineProps } from 'vue'
import { backendStatic, ip, port } from '@/api/config';

defineProps({
    posterSrc: String,
    title: String,
    author: String,
    avatarSrc: String,
    userId: [String, Number],
    noteId: [String, Number],
    likes: Number
});
</script>

<template>
    <div class="note-card-wrapper">
        <div class="note-intro">
            <img :src="posterSrc || `${ip}:${port}${backendStatic}/default.jpg`" />
            <span>{{ title }}</span>
        </div>
        <div class="author-wrapper">
            <div class="author">
                <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
                <span>{{ author }}</span>
            </div>
            <span class="count">
                <svg data-v-7c2d5134="" data-v-6997b738="" class="reds-icon like-icon" width="16" height="16">
                    <use data-v-7c2d5134="" xlink:href="#like"></use>
                </svg>
                <span>{{ likes }}</span>
            </span>
        </div>
    </div>
</template>

<style lang="scss">
@import '../common/style/func.scss';

.note-intro {
    img {
        height: responsive(200, vh);
    }
}
</style>
