<script setup lang="ts">
import { ref } from 'vue';
import { debounce } from 'lodash';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import CustomInput from '@/components/custom-input.vue';
import NullState from '@/components/null-state.vue';
import { ICustomInput, debounceTime, initNotPass } from './ts';

const userInfo = getUserInfo();

const oldPassword = ref<HTMLInputElement>();
const newPassword = ref<HTMLInputElement>();
const confirmPassword = ref<HTMLInputElement>();
const username = ref<HTMLInputElement>();

const intro = ref<HTMLInputElement>();
const introLen = ref(0);
const countLength = () => {
    introLen.value = intro.value?.value.length || 0;
}

const file = ref<HTMLInputElement>();
const handlerFile = () => {
    if (!file.value) {
        useToast("网络不好，请稍后再试", "error");
        // 埋点上报没有拿到组件问题
        return
    }
    console.log(file.value.files)
}

const showModify = ref(false);
const expend = () => {
    showModify.value = !showModify.value;
}

let verify = initNotPass
const handlerVerify = debounce((component: ICustomInput | undefined, bit: number) => {
    if (!component) {
        useToast("网络不好，请稍后再试");
        // 埋点上报没有拿到组件问题
        return;
    }
    if (!component.component.checkValidity() || !component.component.value) {
        component.show();
        verify |= 1 << bit;
    } else {
        component.hide();
        verify &= ~(1 << bit);
    }
}, debounceTime)
</script>

<template>
    <template v-if="userInfo">
        <div class="base-info pd-20">
            <div class="avatar">
                <label for="avatar">
                    <img src="@/assets/default.jpg" alt="头像">
                </label>
                <input ref="file" @change="handlerFile" hidden type="file" id="avatar"
                    accept="image/png,image/jpg,image/jpeg" />
            </div>
            <CustomInput ref="username" maxlength="10" max-len="10" :placeholder="userInfo.username || '请输入用户名'" />
        </div>
        <div class="description pd-20">
            格式：支持JPG、PNG、JPEG
            <br>
            大小：5M以内
        </div>
        <div class="pos-abs mlr-20">
            <h5>个人介绍</h5>
            <textarea @input="countLength" ref="intro" class="intro" maxlength="100"
                :placeholder="userInfo.intro || '请输入个人简介'"></textarea>
            <span>{{ introLen }}/100</span>
        </div>
        <div class="password pd-20">
            <h5 @click="expend">修改密码</h5>
            <div class="modify-pass" :class="{ 'show-modify': showModify }">
                <CustomInput @input="handlerVerify" ref="oldPassword" type="password" minlength="6" maxlength="20"
                    max-len="20" placeholder="请输入旧密码" err-msg="长度在6~20之间" />
                <CustomInput @input="handlerVerify" ref="newPassword" type="password" minlength="6" maxlength="20"
                    max-len="20" placeholder="请输入新密码" err-msg="长度在6~20之间" />
                <CustomInput @input="handlerVerify" ref="confirmPassword" type="password" minlength="6" maxlength="20"
                    max-len="20" placeholder="请确认新密码" err-msg="长度在6~20之间" />
            </div>
        </div>
        <div class="save">
            <button>保存</button>
        </div>
    </template>
    <NullState v-else />
</template>

<style lang="scss" scoped>
@import "../../common/style/func.scss";

.pd-20 {
    padding: 0 20px;
}

.mlr-20 {
    margin: 0 20px;
}

.pos-abs {
    position: relative;

    span {
        position: absolute;
        right: responsive(5, vw);
        color: hsla(0, 0%, 100%, 0.46);
        font-size: 12px;
        bottom: responsive(8, vh)
    }
}

.base-info {
    box-sizing: border-box;
    padding-top: 20px;
    display: flex;
    align-items: center;

    ::v-deep .custom {
        flex: 1;
    }
}

.avatar {
    margin-right: responsive(50, vw);

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
    width: 100%;
    min-height: 80px;
    color: #fff;
    overflow: auto;
    border-radius: 5px;
}

.password {
    border: 1px solid #a2a1a1;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;

    h5 {
        margin: 10px 0;
    }
}

.modify-pass {
    width: 100%;
    transition: all 1s;
    max-height: 0;
    overflow: hidden;

    input {
        margin-bottom: 10px;
    }
}

.show-modify {
    max-height: 50vh;
}

.save {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #595454;

    button {
        padding: responsive(15, vh) responsive(150, vw);
        border-radius: responsive(30, vh);
        background-color: rgb(94, 154, 134);
        color: #fff;
        border: none;
    }
}
</style>