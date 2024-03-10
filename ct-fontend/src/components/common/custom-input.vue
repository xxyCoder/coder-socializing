<script setup lang="ts">
import { ref, defineEmits, defineExpose, defineProps } from 'vue';

const props = defineProps({
    maxlength: {
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
    type: {
        type: String,
        default: 'text'
    },
    errMsg: {
        type: String,
        default: ''
    },
    initVal: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['input'])
const handlerInput = () => {
    countInputLen();
    emit('input');
}

const component = ref<HTMLInputElement>();
const len = ref(props.initVal);
const countInputLen = () => {
    len.value = component.value?.value.length || 0;
}

const showError = ref(false);
defineExpose({
    component,
    hide() {
        showError.value = false;
    },
    show() {
        showError.value = true;
    }
})
</script>

<template>
    <div class="custom">
        <input ref="component" :type="type" :minlength="minlength" :maxlength="maxlength" :placeholder="placeholder"
            @input="handlerInput" />
        <div>
            <span>{{ len }}/{{ maxlength }}</span>
        </div>
    </div>
    <span :class="[showError ? 'show-tips' : 'hide-tips']">{{ errMsg }}</span>
</template>

<style lang="scss" scoped>
@import "../../common/style/func.scss";

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
        outline: none;
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

.hide-tips {
    opacity: 0;
}

.show-tips {
    opacity: 1;
    color: rgb(250, 93, 93);
    transition: opacity .5s;
}
</style>