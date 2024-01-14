<script setup lang="ts">
import { ref } from 'vue';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';

const userInfo = getUserInfo();
const file = ref<HTMLInputElement>();
const handlerFile = () => {
    if (!file.value) {
        useToast("网络不好，请稍后再试", "error");
        // 埋点上报没有拿到组件问题
        return
    }
    console.log(file.value.files)
}
</script>

<template>
    <div class="base-info pd-20">
        <div class="avatar">
            <label for="avatar">
                <img src="@/assets/default.jpg" alt="头像">
            </label>
            <input ref="file" @change="handlerFile" hidden type="file" id="avatar" accept="image/png,image/jpg,image/jpeg"
                size="" />
        </div>
        <input type="text" :placeholder="userInfo?.username || '请输入用户名'" />
    </div>
    <div class="description pd-20">
        格式：支持JPG、PNG、JPEG
        <br>
        大小：5M以内
    </div>
    <textarea class="intro"></textarea>
    <div class="password">
        <button>修改密码</button>
    </div>
</template>

<style lang="scss">
@import "../../common/style/func.scss";

.pd-20 {
    padding: 0 20px;
}

.base-info {
    box-sizing: border-box;
    padding-top: 20px;
    display: flex;
    align-items: center;

    input {
        flex: 1;
        margin-left: responsive(20, vh);
        height: responsive(30, vh);
        background-color: #2f2f2f;
        color: #fff;
        border: 1px solid #000;
        border-radius: responsive(10, vh);
        margin-bottom: 10px;
    }
}

.avatar {
    img {
        height: responsive(80, vh);
        border-radius: 50%;
    }
}


.description {
    color: hsla(0, 0%, 100%, 0.46);
    font-size: 13px;
    margin-top: 10px;
}

.intro {
    background-color: #2f2f2f;
    margin: 10px 20px;
}

.password {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;

    button {}
}
</style>