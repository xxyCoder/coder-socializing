<script setup lang="ts">
import { PropType, defineProps } from 'vue'
import type { IntercationItemType } from '@/common/types/index'

defineProps({
    list: {
        type: Array as PropType<Array<IntercationItemType>>
    }
})
</script>

<template>
    <ul class="intercation">
        <li></li>
    </ul>
</template>

<style scoped lang="scss"></style>
