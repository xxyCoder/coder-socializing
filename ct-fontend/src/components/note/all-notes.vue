<script setup lang="ts">
import { PropType, defineProps, defineEmits } from 'vue';
import { type NoteCardType } from '@/common/types';
import NoteCard from './note-card.vue';
import NullData from '@/components/common/null-data.vue';

const props = defineProps({
  showInfos: {
    type: Array as PropType<NoteCardType[]>,
    default() {
      return []
    }
  }
})

const emits = defineEmits(['reqNotes'])

const VIntersect = {
  mounted(el: Element, { value }: { value: number }) {
    if (value === props.showInfos.length - 5) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            emits('reqNotes')
            io.unobserve(entry.target)
          }
        })
      }, {
        threshold: 1
      })
      io.observe(el)
    }
  }
}
</script>

<template>
  <div class="note-info">
    <note-card v-for="(item, i) in showInfos" :key="item.id" :author="item.username" :title="item.title"
      :note-id="item.id" :user-id="item.userId" :poster-src="item.posterSrc" :avatar-src="item.avatarSrc"
      :is-video="item.isVideo" :likes="item.likeCnt" :is-like="item.isLike" v-intersect="i" />
    <null-data style="margin-top: 50px;" v-if="!showInfos.length" />
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.note-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0 responsive(20, vw) responsive(100, vw);
}
</style>