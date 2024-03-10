<script setup lang="ts"></script>

<template>
    <div class="no-data">
        <img src="@/assets/logo.png">
        <div class="content">
            <slot>没有内容~</slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../common/style/func.scss';

.no-data {
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    justify-content: center;
    width: 100%;

    img {
        width: responsive(200, vw);
        height: responsive(200, vw);
    }

    .content {
        color: hsla(0, 0%, 100%, 0.6);
        font-size: 14px;
        margin-top: 20px;
    }
}
</style>
