<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { userLogin } from '@/api/users';
import { cryptoPassword } from './ts/index'
import { useToast } from "@/components/Toast/index";
import { useLoading } from '@/components/Loading/index';
import { setUserInfo } from '@/common/ts/user-info';
import { useEventSource } from '@/common/ts/correspondence';

const account = ref<HTMLInputElement>();
const password = ref<HTMLInputElement>();
const router = useRouter();

const handlerLogin = () => {
    if (!account.value || !password.value) {
        useToast("网络不好，请稍后再试", "error");
        // 埋点上报没有拿到组件问题
        return
    }
    const acc = account.value.value, pass = password.value.value
    if (!acc || !pass) {
        useToast("请输入完整");
        return;
    }
    const remove = useLoading()
    userLogin({ account: acc, password: cryptoPassword(pass) })
        .then(res => {
            if (!res) throw new Error('空结果');
            remove();
            setUserInfo(res)
            localStorage.setItem('user-info', JSON.stringify({ id: res.id, account: res.account }))
            useEventSource(res.id)
            useToast("登录成功")
                .then(() => {
                    router.replace('/');
                })
        })
        .catch(() => {
            remove();
        })
}
</script>

<template>
    <div class="ct-login">
        <img src="@/assets/logo.png" alt="">
        <h1>coder 登录</h1>
        <input ref="account" type="text" placeholder="请输入账户名" required />
        <input ref="password" type="password" placeholder="请输入密码" required />
        <router-link to="/registration" replace>还没有账户？去注册</router-link>
        <button @click="handlerLogin" class="ct-login-btn">登录</button>
    </div>
</template>


<style scoped lang="scss">
@import "../../common/style/func.scss";

.ct-login {
    background-color: #fff;
    color: #000;
    min-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

img {
    height: responsive(50, vh);
}

h1 {
    font-size: 20px;
}

input {
    display: block;
    margin: responsive(12, vh) 0;
    box-sizing: border-box;
    padding: responsive(10, vh) responsive(15, vw);
    width: 90vw;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 3vw;
    outline: none;
    box-shadow: 8px 8px 10px rgba(0, 0, 0, 0.3);
}

.ct-login-btn {
    box-sizing: border-box;
    padding: responsive(10, vh) responsive(120, vw);
    border-radius: responsive(30, vh);
    border: none;
    margin-top: 10px;
    background-color: rgb(123, 153, 227);
}
</style>