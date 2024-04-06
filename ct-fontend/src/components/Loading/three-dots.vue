<script setup lang="ts"></script>

<template>
    <div class="three-dots">
        <span v-for="i in 3" :key="i" :class="'dot' + i">.</span>
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.three-dots {
    height: responsive(30, vw);
    width: responsive(30, vw);
    position: relative;

    span {
        position: absolute;
        padding: 0 responsive(2, vw);
        transition: transform 1s;
    }
}

@keyframes jump {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-40%);
    }

    100% {
        transform: translateY(-80%);
    }
}

@for $i from 1 through 3 {
    .dot#{$i} {
        animation: jump 1.5s linear $i * 0.5s infinite alternate;
        left: responsive($i * 10, vw);
    }
}
</style>
