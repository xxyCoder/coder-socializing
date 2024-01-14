<script lang="ts" setup>
import { ref } from 'vue';
import { debounce } from 'lodash'
import { userRegistry } from '@/api/users';
import { useToast } from '@/components/Toast/index';
import { useLoading } from '@/components/Loading/index'
import { debounceTime, InputMap, initNotPass, cryptoPassword } from './ts/index'
import { useRouter } from 'vue-router';

const username = ref<HTMLInputElement>();
const account = ref<HTMLInputElement>();
const password = ref<HTMLInputElement>();
const confirmPassword = ref<HTMLInputElement>();
const router = useRouter()

let verify = initNotPass

const handlerRegistered = () => {
    if (!username.value || !account.value || !password.value || !confirmPassword.value) {
        useToast("网络不好，请稍后再试");
        // 埋点上报没有拿到组件问题
        return;
    }
    console.log(verify)
    if (verify) {
        useToast("输入不符合要求", "error");
        return;
    }
    const remove = useLoading()
    userRegistry({ username: username.value.value, account: account.value.value, password: cryptoPassword(password.value.value) })
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg);
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

const handlerVerify = debounce((component: HTMLInputElement | undefined, bit: number) => {
    if (!component) {
        useToast("网络不好，请稍后再试");
        // 埋点上报没有拿到组件问题
        return;
    }
    if (!component.checkValidity() || !component.value) {
        component.nextElementSibling?.classList.add('error');
        verify |= 1 << bit;
    } else {
        component.nextElementSibling?.classList.remove('error');
        verify &= ~(1 << bit);
    }
}, debounceTime)
</script>

<template>
    <div class="ct-registration">
        <img src="@/assets/logo.png" alt="">
        <h1>coder 注册</h1>
        <input @input="handlerVerify(username, InputMap.username)" ref="username" type="text" placeholder="请输入用户名"
            minlength="1" maxlength="10" />
        <span>长度应该在1~10之间</span>
        <input @input="handlerVerify(account, InputMap.account)" ref="account" type="text" placeholder="请输入账户名"
            minlength="6" maxlength="16" />
        <span>长度应该在6~16之间</span>
        <input @input="handlerVerify(password, InputMap.password)" ref="password" type="password" placeholder="请输入密码"
            minlength="6" maxlength="20" />
        <span>长度应该在6~20之间</span>
        <input @input="handlerVerify(confirmPassword, InputMap.confirmPassword)" ref="confirmPassword" type="password"
            placeholder="请重复输入密码" minlength="6" maxlength="20" />
        <span>两次密码不一致</span>
        <router-link to="/login" replace>有账户？去登录</router-link>
        <button @click="handlerRegistered" class="ct-registered-btn">注册</button>
    </div>
</template>


<style scoped lang="scss">
@import "../../common/style/func.scss";

.error {
    color: rgb(250, 93, 93);
    opacity: 1;
    transition: opacity .5s;
}

.ct-registration {
    background-color: #fff;
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
    margin: responsive(3, vh) 0;
    box-sizing: border-box;
    padding: responsive(10, vh) responsive(15, vw);
    width: 90vw;
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 3vw;
    outline: none;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
}

span {
    opacity: 0;
}

.ct-registered-btn {
    box-sizing: border-box;
    padding: responsive(10, vh) responsive(120, vw);
    border-radius: responsive(30, vh);
    border: none;
    margin-top: 10px;
    background-color: rgb(235, 111, 94);
}
</style>