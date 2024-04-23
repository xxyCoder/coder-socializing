<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

defineProps({
  btnText: String
});
const emits = defineEmits(['click']);
</script>

<template>
  <div class="save">
    <button @click="emits('click')">{{ btnText }}</button>
  </div>
</template>

<style scoped lang="scss">
@import "../../common/style/func.scss";

.save {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #595454;

  button {
    padding: responsive(15, vh) responsive(150, vw);
    border-radius: responsive(30, vh);
    background-color: rgb(94, 154, 134);
    color: #fff;
    border: none;
  }
}
</style>
