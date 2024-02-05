<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue';
import { useToast } from '../Toast';

const media = ref<HTMLInputElement>()
const mediaList = ref<File[]>([])
const mediaUrls = ref<Array<string>>([])
const isVideo = ref(false)

const showUpload = computed(() => !isVideo.value && mediaUrls.value.length < 6)

const uploadImg = () => {
    if (media.value?.files && media.value.files.length > 0) {
        const file = media.value.files[0]
        media.value.files = null
        if (file.type.startsWith('video/')) {
            if (mediaList.value.length > 0) {
                useToast('上传了图片就不能再次上传视频了~')
                return
            }
            isVideo.value = true
        }
        mediaList.value.push(file)
        if (isVideo.value) {
            const url = URL.createObjectURL(file)
            mediaUrls.value.push(url)
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result
                typeof url === 'string' && mediaUrls.value.push(url);
            }
            reader.onerror = () => {
                useToast('上传失败');
            }
            reader.readAsDataURL(file)
        }
    }
}

defineExpose({
    mediaList,
    isVideo
})
</script>

<template>
    <div class="upload-img">
        <video v-if="isVideo" class="box" :src="mediaUrls[0]"></video>
        <img v-else class="box" v-for="(url, idx) in mediaUrls" :src="url" :key="idx" />
        <label v-if="showUpload" for="img" class="box">+</label>
        <input @input="uploadImg" ref="media" type="file" id="img" accept="image/*,video/*">
    </div>
    <p v-if="!mediaUrls.length" class="tips">
        图片和视频二选一，视频只能上传一个，图片最多上传六张。
        <br>
        上传两个类型中一个才能编辑其余内容并且上传~
    </p>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.box {
    height: responsive(110, vh);
    width: responsive(110, vh);
    border-radius: responsive(5, vh);
    margin-right: 10px;
    margin-bottom: 10px;
}

.upload-img {
    display: flex;
    flex-wrap: wrap;

    label {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        background-color: #202020;
    }

    input {
        display: none;
    }
}

.tips {
    box-sizing: border-box;
    border: 1px solid #3d3636;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #4f4f4f;
    font-size: 14px;
    padding: 10px;
}
</style>
