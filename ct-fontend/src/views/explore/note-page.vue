<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getNoteDetail } from '@/api/note'
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';

const route = useRoute();
const { id } = route.params;
const remove = useLoading()
getNoteDetail(`?noteId=${id}`)
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        remove();
    })
    .catch(err => {
        remove();
        useToast(err.message);
    })
</script>

<template>
    <div class="note-page"></div>
</template>

<style scoped lang="scss"></style>
