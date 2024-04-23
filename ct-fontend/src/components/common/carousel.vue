<script setup lang="ts">
import { PropType, computed, defineProps, ref } from 'vue';
const props = defineProps({
  list: {
    type: Array as PropType<Array<string>>,
    default() {
      return []
    }
  }
})

const cordX = ref(0)
const tabIdx = ref(0)
const stop = ref(true)
let start = 0, tmp = 0;
const moveDis = window.innerWidth / 4;
const handlerTouchStart = (e: TouchEvent) => {
  start = e.touches[0].clientX;
  tmp = cordX.value;
  stop.value = false
}

const handlerTouchMove = (e: TouchEvent) => {
  cordX.value = tmp + e.touches[0].clientX - start
}

const banner = ref<HTMLUListElement>()
const offset = computed(() => banner.value?.children[0].getBoundingClientRect().width);
const handlerTouchEnd = () => {
  stop.value = true
  const diff = cordX.value - tmp
  cordX.value = tmp;
  if (Math.abs(diff) >= moveDis && offset.value) {
    if (diff < 0) {
      cordX.value -= offset.value;
    } else if (diff > 0) {
      cordX.value += offset.value;
    }
    cordX.value = Math.min(0, cordX.value)
    cordX.value = Math.max(-offset.value * (props.list.length - 1), cordX.value)
    tabIdx.value = -cordX.value / offset.value;
  }
}

const changeIdx = (e: MouseEvent) => {
  tabIdx.value = Number((e.target as HTMLDivElement).dataset.idx)
  offset.value && (cordX.value = -tabIdx.value * offset.value)
}
</script>

<template>
  <div class="banner">
    <ul ref="banner" :class="['wrapper', { 'animation': stop }]" :style="{ transform: `translate(${cordX}px)` }"
      @touchstart="handlerTouchStart" @touchmove="handlerTouchMove" @touchend="handlerTouchEnd">
      <li v-for="(item, idx) in list" :key="idx">
        <img :src="item" />
      </li>
    </ul>
  </div>
  <div class="sliders" @click="changeIdx">
    <div v-for="(_, idx) in list" :data-idx="idx" :key="idx" :class="['dot', { 'active': tabIdx === idx }]"></div>
  </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.banner {
  overflow: hidden;
}

.animation {
  transition: transform .1s;
}

.wrapper {
  display: flex;
  list-style: none;
  height: fit-content;
  margin: 0;
  padding: 0;

  li {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  img {
    height: responsive(200, vh);
  }
}

.sliders {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

.dot {
  margin: 0 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: .5;
  background-color: #fff;
  transition: background-color .1s;
  cursor: pointer;
}

.active {
  background-color: #1e80ff;
}
</style>
