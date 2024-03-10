<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash'
import { userRegistry } from '@/api/users';
import { useToast } from '@/components/Toast/index';
import { useLoading } from '@/components/Loading/index'
import CustomInput from '@/components/common/custom-input.vue';
import { debounceTime, InputMap, initNotPass, cryptoPassword } from './ts/index'
import { CustomInputComponent } from '@/common/types';

const username = ref<CustomInputComponent>();
const account = ref<CustomInputComponent>();
const password = ref<CustomInputComponent>();
const confirmPassword = ref<CustomInputComponent>();
const router = useRouter()

let verify = initNotPass

const handlerRegistered = () => {
    if (!username.value || !account.value || !password.value || !confirmPassword.value) {
        useToast("网络不好，请稍后再试");
        // 埋点上报没有拿到组件问题
        return;
    }
    if (verify) {
        useToast("输入不符合要求", "error");
        return;
    }
    const remove = useLoading()
    userRegistry({ username: username.value.component.value, account: account.value.component.value, password: cryptoPassword(password.value.component.value) })
        .then(() => {
            remove();
            useToast("注册成功")
                .then(() => {
                    router.replace('/login');
                })
        })
        .catch(err => {
            remove();
            useToast(err.msg || "网络错误");
            // 埋点上报
        })
}

const handlerVerify = debounce((component: CustomInputComponent | undefined, bit: number) => {
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
    <div class="ct-registration">
        <img src="@/assets/logo.png" alt="">
        <h1>coder 注册</h1>
        <CustomInput ref="username" @input="handlerVerify(username, InputMap.username)" type="text" placeholder="请输入用户名"
            minlength="1" maxlength="10" err-msg="长度应该在1~10之间" />
        <CustomInput @input="handlerVerify(account, InputMap.account)" ref="account" type="text" placeholder="请输入账户名"
            minlength="6" maxlength="16" err-msg="长度应该在6~16之间" />
        <CustomInput @input="handlerVerify(password, InputMap.password)" ref="password" type="password" placeholder="请输入密码"
            minlength="6" maxlength="20" max-len="20" err-msg="长度应该在6~20之间" />
        <CustomInput @input="handlerVerify(confirmPassword, InputMap.confirmPassword)" ref="confirmPassword" type="password"
            placeholder="请重复输入密码" minlength="6" maxlength="20" max-len="20" err-msg="两次密码不一致" />
        <router-link to="/login" replace>有账户？去登录</router-link>
        <button @click="handlerRegistered" class="ct-registered-btn">注册</button>
    </div>
</template>


<style scoped lang="scss">
@import "../../common/style/func.scss";

.ct-registration {
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ::v-deep .custom {
        width: 90%;
    }
}

img {
    height: responsive(50, vh);
}

h1 {
    font-size: 20px;
}

.ct-registered-btn {
    box-sizing: border-box;
    padding: responsive(10, vh) responsive(120, vw);
    border-radius: responsive(30, vh);
    border: none;
    margin-top: 10px;
    background-color: rgb(235, 111, 94);
    color: #fff;
}
</style>