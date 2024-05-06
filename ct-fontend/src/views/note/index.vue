<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UploadImg from '@/components/note/upload-img.vue';
import { UploadImgComp } from './ts/type'
import CustomInput from '@/components/common/custom-input.vue';
import CustomTextarea from '@/components/common/custom-textarea.vue';
import BottomButton from '@/components/common/bottom-button.vue';
import NullState from '@/components/common/null-state.vue'
import { useToast } from '@/components/Toast';
import { CustomComponent, CustomInputComponent } from '@/common/types';
import { publishNote, updateNote } from '@/api/note';
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import { listMap } from '@/common/constant';
import { useModNoteStore } from '@/store';


const router = useRouter();
const route = useRoute()
const { noteId, isMod } = route.query

const userInfo = getUserInfo()
const uploadImgRef = ref<UploadImgComp>();
const showPublish = computed(() => (uploadImgRef.value?.mediaList.length || 0) > 0 || isMod === 'true');
const inputComp = ref<CustomInputComponent>();
const textareaComp = ref<CustomComponent>();
const selectTag = ref<HTMLSelectElement>();

onMounted(() => {
  if (isMod === 'true') {
    const note = useModNoteStore().note
    if (uploadImgRef.value) {
      uploadImgRef.value.isVideo = note.isVideo
      uploadImgRef.value.mediaUrls = note.mediaList
    }
    if (inputComp.value) {
      inputComp.value.component.value = note.title
    }
    if (textareaComp.value) {
      textareaComp.value.component.value = note.content
    }
    if (selectTag.value) {
      selectTag.value.selectedIndex = Object.keys(listMap).findIndex(v => listMap[v] === note.tag)
    }
  }
})

const handlerPublish = () => {
  if (!userInfo || !userInfo.id) {
    useToast('请先登录');
    return
  }
  const mediaUrls = uploadImgRef.value?.mediaUrls || []
  if (mediaUrls.length === 0) {
    useToast('至少上传一张图片或视频才能发布~')
    return
  }
  const title = inputComp.value?.component.value, content = textareaComp.value?.component.value
  if (!title) {
    useToast('需要填写标题哦~');
    return;
  }
  if (!selectTag.value) {
    useToast('标签不存在');
    return;
  }
  const formData = new FormData();
  formData.set('title', title);
  formData.set('category', selectTag.value.selectedOptions[0].value)
  uploadImgRef.value?.mediaList.forEach(media => {
    if (media instanceof File) {
      formData.append('mediaList', media, media.name)
    } else {
      formData.append('mediaListStr', media)
    }
  })
  content && formData.set('content', content);
  uploadImgRef.value && formData.set('is_video', JSON.stringify(uploadImgRef.value.isVideo))
  const remove = useLoading();
  let msg = '发布成功', reqAPI = publishNote
  if (isMod) {
    uploadImgRef.value && formData.set('staticUrls', uploadImgRef.value.mediaUrls.filter(url => /^http:/.test(url)).join(';'))
    noteId && formData.set('noteId', String(noteId))
    msg = '更新成功'
    reqAPI = updateNote
  }
  reqAPI(formData)
    .then(() => {
      remove();
      useToast(msg)
        .then(() => router.replace(`/user/${userInfo.id}`))
    })
    .catch(() => {
      remove();
    })
}
</script>

<template>
  <template v-if="userInfo?.id">
    <div class="note-edit container">
      <UploadImg ref="uploadImgRef" />
      <template v-if="showPublish">
        <CustomInput ref="inputComp" :maxlength="20" placeholder="记得填写标题哦" />
        <br>
        <CustomTextarea ref="textareaComp" :maxlength="1000" placeholder="正文（可选）" />
        <select class="tags" ref="selectTag">
          <option v-for="(val, name) in listMap" :key="name" :value="val">{{ name }}</option>
        </select>
      </template>
    </div>
    <BottomButton v-if="showPublish" btn-text="发布" @click="handlerPublish" />
  </template>
  <NullState v-else />
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

.tags {
  border: 1px solid #3c3c3c;
  outline: none;
  box-sizing: border-box;
  padding: responsive(8, vh) responsive(24, vw);
  background-color: #000;
  color: #fff;
  font-size: 12px;
}
</style>
