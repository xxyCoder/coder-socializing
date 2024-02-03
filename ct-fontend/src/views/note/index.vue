<script setup lang="ts">
import { computed, ref } from 'vue';
import UploadImg from '@/components/note/upload-img.vue';
import { UploadImgComp } from './ts/type'
import CustomInput from '@/components/custom-input.vue';
import CustomTextarea from '@/components/custom-textarea.vue';
import BottomButton from '@/components/bottom-button.vue';
import { useToast } from '@/components/Toast';

const uploadImgRef = ref<UploadImgComp>();
const showPublish = computed(() => (uploadImgRef.value?.mediaUrls.length || 0) > 0)

const handlerPublish = () => {
    if (uploadImgRef.value?.mediaUrls.length === 0) {
        useToast('至少上传一张图片或视频才能发布~')
        return
    }

}
</script>

<template>
    <div class="note-edit container">
        <UploadImg ref="uploadImgRef" />
        <template v-if="uploadImgRef?.mediaUrls.length">
            <CustomInput :maxlength="20" placeholder="记得填写标题哦" />
            <br>
            <CustomTextarea :maxlength="1000" placeholder="正文（可选）" />
            <button class="btn">#标签</button><button class="btn">@用户</button>
        </template>
    </div>
    <BottomButton v-if="showPublish" btn-text="发布" @click="handlerPublish" />
</template>

<style lang="scss" scoped>
@import '../../common/style/global.scss';
@import '../../common/style/func.scss';

.btn {
    border: 1px solid #3c3c3c;
    border-radius: responsive(4, vh);
    margin: 5px 5px 0 0;
    padding: responsive(8, vh) responsive(24, vw);
    background-color: #2f2f2f;
    color: #fff;
    font-size: 12px;
}
</style>
