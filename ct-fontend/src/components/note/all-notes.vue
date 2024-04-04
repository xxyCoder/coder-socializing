<script setup lang="ts">
import { NoteCardType } from '@/common/types';
import { PropType, defineProps } from 'vue';
import NoteCard from './note-card.vue';
import NullData from '@/components/common/null-data.vue';

defineProps({
    showInfos: {
        type: Array as PropType<NoteCardType[]>,
        default() {
            return []
        }
    }
})

</script>

<template>
    <div class="note-info">
        <note-card v-for="item in showInfos" :key="item.id" :author="item.username" :title="item.title"
            :note-id="item.id" :user-id="item.userId" :poster-src="item.posterSrc" :avatar-src="item.avatarSrc"
            :is-video="item.isVideo" :likes="item.likeCnt" :is-like="item.isLike" />
        <null-data style="margin-top: 50px;" v-if="!showInfos.length" />
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.note-info {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: responsive(100, vw)
}
</style>