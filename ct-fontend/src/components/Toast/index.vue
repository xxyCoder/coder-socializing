<script lang="ts" setup>
import { PropType, defineProps } from 'vue';
import { toastType } from "./index"

defineProps({
    msg: String,
    type: String as PropType<toastType>
});
</script>

<template>
    <div class="toast">
        <div class="toast-header">
            <span class="normalBg" :class="{ errorBg: type === 'error', warnBg: type === 'warn' }"></span>
            <span :class="{ errorCl: type === 'error', warnCl: type === 'warn' }">
                {{ type === 'error' ? 'ERROR' : type === 'warn' ? 'WARN' : '' }}
            </span>
        </div>
        <p class="toast-content">{{ msg }}</p>
    </div>
</template>

<style lang="scss" scoped>
.toast {
    background-color: rgba(255, 255, 255, .85);
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: .25rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .1);
    backdrop-filter: blur(10px);
    animation: animate 3s ease-in-out;
    box-sizing: border-box;
    padding: .375rem .75rem;
    border-radius: .3125rem;
    --error: rgb(235, 78, 70);
    --warn: rgb(239, 236, 73);
    min-width: 18.75rem;
}

.toast-header {
    font-size: 1rem;
    margin-bottom: .3125rem;
    display: flex;
    align-items: center;
}

.normalBg {
    background-color: #000;
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-right: .3125rem;
}

.errorBg {
    background-color: var(--error);
}

.warnBg {
    background-color: var(--warn);
}

.errorCl {
    color: var(--error)
}

.warnCl {
    color: var(--warn)
}

.toast-content {
    font-size: .875rem;
}

@keyframes animate {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>