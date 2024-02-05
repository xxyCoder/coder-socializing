<script setup lang="ts">
import { PropType, computed, defineProps, onMounted, ref, defineEmits } from 'vue';

const props = defineProps({
    list: {
        type: Array as PropType<Array<string>>,
        default() {
            return []
        }
    }
});
const activeIdx = ref(0);
const activeWidth = computed(() => props.list[activeIdx.value].length * 16 + 'px');

const ul = ref<HTMLUListElement>()
const listLeftPos = ref<Array<number>>([]);
const activeLeft = computed(() => listLeftPos.value[activeIdx.value] + 'px');
onMounted(() => {
    if (ul.value) {
        for (let i = 0, n = ul.value.children.length; i < n - 1; ++i) {
            const li = ul.value.children[i];
            listLeftPos.value.push(li.getBoundingClientRect().x);
        }
    }
})

const emits = defineEmits(['click'])
const handlerClick = (idx: number) => {
    activeIdx.value = idx
    emits('click', idx)
}
</script>

<template>
    <ul class="sticky-list" ref="ul">
        <li v-for="(l, i) in list" :key="l" @click="handlerClick(i)">{{ l }}</li>
        <li class="active-tag" :style="{ width: activeWidth, left: activeLeft }"></li>
    </ul>
</template>

<style scoped lang="scss">
@import '../common/style/func.scss';

.sticky-list {
    position: relative;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    display: flex;
    justify-content: space-around;
    align-items: center;

    li {
        padding: responsive(20, vh) responsive(30, vw);
        color: hsla(0, 0%, 100%, 0.8);
        white-space: nowrap;
        z-index: 1;
    }
}

.active-tag {
    position: absolute;
    background-color: hsla(0, 0%, 100%, 0.12);
    padding: responsive(20, vh) responsive(30, vw);
    border-radius: responsive(20, vh);
    transition: .5s;
}
</style>
