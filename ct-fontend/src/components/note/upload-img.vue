<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import { useToast } from '../Toast';

const image = ref<HTMLInputElement>()
const imgList: File[] = []
const imgUrls = ref<Array<string>>([])
const uploadImg = () => {
    console.log(image.value?.files)
    if (image.value?.files && image.value.files.length > 0) {
        const file = image.value.files[0]
        image.value.files = null
        imgList.push(file)
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result
            typeof url === 'string' && imgUrls.value.push(url);
        }
        reader.onerror = () => {
            useToast('上传失败');
        }
        reader.readAsDataURL(file)
    }
}

defineExpose({
    component: image
})
</script>

<template>
    <div class="upload-img">
        <img class="box" v-for="(url, idx) in imgUrls" :src="url" :key="idx" />
        <label for="img" class="box">+</label>
        <input @input="uploadImg" ref="image" type="file" id="img" accept="image/*">
    </div>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.box {
    height: responsive(100, vh);
    width: responsive(100, vh);
    border-radius: responsive(5, vh);
    margin-right: 10px;
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
</style>
