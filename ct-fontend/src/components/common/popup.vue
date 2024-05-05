<script setup lang="ts">
import { defineEmits, defineProps, defineExpose, ref } from 'vue';

const emits = defineEmits(['confirm', 'cancel'])
defineProps({
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  content: {
    type: String,
    default: '确认后操作无法撤销'
  }
})

const isShow = ref(false)
function hide() {
  isShow.value = false
}

function show() {
  isShow.value = true
}

function handlerConfirm() {
  emits('confirm')
  hide()
}
function handlerCancel() {
  emits('cancel')
  hide()
}

defineExpose({
  hide,
  show
})

const hieghtTransitionStyle = 'height 0.3s ease-in-out, padding 0.3s ease-in-out';
let pd = (20 / 750 * 100) + 'vw'
const hooks = {
  css: false,
  onBeforeEnter(el: HTMLElement) {
    // 给元素设置过渡效果
    el.style.transition = hieghtTransitionStyle;
    // 高度变化时，让其内容隐藏
    el.style.overflow = 'hidden';
  },
  onEnter(el: HTMLElement, done: () => void) {
    // 保存元素原来的高度
    const endHeight = el.scrollHeight + 'px';
    el.style.padding = pd
    el.style.height = '0px';
    // 强制浏览器回流，否则浏览器会合并两次元素的高度更改（回流重绘的知识）
    el.offsetHeight;
    el.style.height = endHeight;
  },
  afterEnter(el: HTMLElement) {
    // el.style.height = null;
    // 收尾工作，展示完过渡效果之后，设为原来的值
    el.style.transition = '';
    el.style.overflow = 'visible';
  },
  onBeforeLeave(el: HTMLElement) {
    // 给元素设置过渡效果
    el.style.transition = hieghtTransitionStyle;
    // 高度变化时，让其内容隐藏
    el.style.overflow = 'hidden';
  },
  onLeave(el: HTMLElement, done: () => void) {
    // 设置高度为具体的值
    el.style.height = el.scrollHeight + 'px';
    // 强制浏览器回流，否则浏览器会合并两次元素的高度更改（回流重绘的知识）
    el.offsetHeight;
    el.style.height = '0px';
    el.style.padding = '0px'
  },
  afterLeave(el: HTMLElement) {
    // el.style.height = null;
    // 收尾工作，展示完过渡效果之后，设为原来的值
    el.style.transition = '';
    el.style.overflow = 'visible';
  }
};
</script>

<template>
  <div class="mask" v-show="isShow"></div>
  <transition v-bind="hooks">
    <div class="popup" v-show="isShow">
      <p class="content">{{ content }}</p>
      <div class="btns">
        <button class="confirm" @click="handlerConfirm">{{ confirmText }}</button>
        <button class="cancel" @click="handlerCancel">{{ cancelText }}</button>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';
@import '../../common/style/global.scss';

.popup {
  border-radius: responsive(20, vw) responsive(20, vw) 0 0;
  background-color: #fff;
  z-index: 1000;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.content {
  color: #000;
  font-size: 18px;
}

.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    box-sizing: border-box;
    flex: 1;
    padding: responsive(30, vw);
    border-radius: responsive(20, vw);
    border: none;
  }
}

.confirm {
  background-color: #1e80ff;
  margin-right: responsive(20, vw);
  color: #fff;
}

.cancel {
  background-color: #e6e5e5;
}
</style>