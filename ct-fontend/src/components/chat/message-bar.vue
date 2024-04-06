<script setup lang="ts">
import { PropType, defineProps, defineEmits } from 'vue'
import { Direction, MessageStatus } from './index'
import { ip, port, backendStatic } from '@/api/config';
import ThreeDots from '../Loading/three-dots.vue';

const props = defineProps({
    dir: {
        type: Number as PropType<Direction>,
        default: Direction.RIGHT
    },
    status: {
        type: Number as PropType<MessageStatus>,
        default: MessageStatus.NORMAL
    },
    avatarSrc: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    sendDate: {
        type: Number,
        default: 0
    },
    idx: {
        type: Number,
        default: -1
    }
})
const emits = defineEmits(['retry'])

const retry = () => {
    emits('retry', props.idx)
}
</script>

<template>
    <div :class="['message-bar', { 'turn': dir === Direction.RIGHT }]">
        <img :src="avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
        <div class="message-box">{{ content }}</div>
        <span class="error" v-show="status === MessageStatus.ERROR" @click="retry">!</span>
        <three-dots v-show="status === MessageStatus.LOADING" />
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.message-bar {
    display: flex;
    column-gap: responsive(20, vw);

    img {
        width: responsive(60, vw);
        height: responsive(60, vw);
        border-radius: 50%;
    }
}

.message-box {
    position: relative;
    padding: responsive(5, vw) responsive(10, vw);
    border-radius: responsive(5, vw);
    background-color: #fff;
    color: #000;
    font-size: 14px;
}

.message-box::before {
    content: "";
    position: absolute;
    left: responsive(-20, vw);
    top: responsive(20, vw);
    border: responsive(10, vw) solid transparent;
    border-right-color: #fff;
}

.turn {
    flex-direction: row-reverse;

    .message-box::before {
        border-right-color: transparent;
        border-left-color: #fff;
        left: 100%;
    }
}

.error {
    height: responsive(30, vw);
    width: responsive(30, vw);
    transform: translateY(responsive(20, vw));
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    color: #000;
    background-color: red;
}
</style>
