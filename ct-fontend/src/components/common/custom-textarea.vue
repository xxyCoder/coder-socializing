<script setup lang="ts">
import { ref, defineExpose, defineProps } from 'vue';

const props = defineProps({
  maxlength: {
    type: Number,
    default: 999
  },
  placeholder: {
    type: String,
    default: ''
  },
  initVal: {
    type: Number,
    default: 0
  }
});

const component = ref<HTMLTextAreaElement>();
const len = ref(props.initVal);
const countLength = () => {
  len.value = component.value?.value.length || 0;
}

defineExpose({
  component
})
</script>

<template>
  <div class="custom">
    <textarea @input="countLength" ref="component" class="intro" :maxlength="maxlength"
      :placeholder="placeholder"></textarea>
    <span>{{ len }}/{{ maxlength }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import "../../common/style/func.scss";

.custom {
  position: relative;

  span {
    position: absolute;
    right: responsive(5, vw);
    color: hsla(0, 0%, 100%, 0.46);
    font-size: 12px;
    bottom: responsive(8, vh)
  }
}

.intro {
  background-color: #2f2f2f;
  width: 100%;
  min-height: 80px;
  color: #fff;
  overflow: auto;
  border-radius: 5px;
}
</style>