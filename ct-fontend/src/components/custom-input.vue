<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps } from 'vue';

defineProps({
    maxLength: {
        type: [Number, String],
        default: 999
    },
    minlength: {
        type: [Number, String],
        default: 0
    },
    placeholder: {
        type: String,
        default: ''
    },
    maxLen: {
        type: [Number, String],
        default: 999
    },
    type: {
        type: String,
        default: 'text'
    }
});

const emit = defineEmits(['input'])
const handlerInput = () => {
    countInputLen();
    emit('input');
}

const input = ref<HTMLInputElement>();
const len = ref(0);
const countInputLen = () => {
    len.value = input.value?.value.length || 0;
}
defineExpose({
    input
})
</script>

<template>
    <div class="custom">
        <input ref="input" :type="type" :minlength="minlength" :maxLength="maxLength" :placeholder="placeholder"
            @input="handlerInput" />
        <div>
            <span>{{ len }}/{{ maxLen }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../common/style/func.scss";

.custom {
    position: relative;

    input {
        box-sizing: border-box;
        padding-left: 5px;
        height: responsive(30, vh);
        background-color: #2f2f2f;
        color: #fff;
        font-size: 12px;
        border: 1px solid #a2a1a1;
        border-radius: 3px;
        width: 100%;
    }

    div {
        position: absolute;
        right: 5px;
        top: 0;
        height: responsive(30, vh);
        display: flex;
        align-items: center;
        color: hsla(0, 0%, 100%, 0.46);
        font-size: 12px;
    }
}
</style>