<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  count: {
    type: Number,
    default: 0
  },
  info: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['click'])

function handlerClick() {
  emits('click')
}
</script>

<template>
  <div class="item" @click="handlerClick">
    <strong>{{ count }}</strong>
    <div>{{ info }}</div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.item {
  margin-right: responsive(20, vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    font-size: 14px;
  }
}
</style>