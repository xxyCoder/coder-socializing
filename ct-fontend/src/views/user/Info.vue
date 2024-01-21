<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import CustomInput from '@/components/custom-input.vue';
import NullState from '@/components/null-state.vue';
import { updateUserInfo, updateUserPass } from '@/api/users'
import { ICustomInput, cryptoPassword, debounceTime, initNotPass, PassMap, MB } from './ts';
import { useLoading } from '@/components/Loading';
import { recapUserInfo } from '@/common/ts/user-info'

const userInfo = getUserInfo();

const intro = ref<HTMLInputElement>();
const introLen = ref(0);
const countLength = () => {
    introLen.value = intro.value?.value.length || 0;
}

const file = ref<HTMLInputElement>();
const avatar = ref<HTMLImageElement>()
const hasAvatar = ref(false)
let formData = new FormData()
const handlerFile = () => {
    if (!file.value) {
        useToast("网络不好，请稍后再试", "error");
        // 埋点上报没有拿到组件问题
        return
    }
    if (file.value.files && file.value.files.length > 0) {
        const img = file.value.files[0];
        const fn = (msg: string) => {
            useToast(msg)
            file.value && (file.value.files = null);
            formData.delete('avatarSrc')
            hasAvatar.value = false
        };
        if (img.size > 4 * MB) {
            fn(`头像大小超过${4 * MB}`)
            return
        }
        formData.set('avatarSrc', file.value.files[0])
        const reader = new FileReader()
        reader.onload = function (e) {
            if (avatar.value && e.target && typeof e.target.result === 'string') {
                avatar.value.src = e.target.result
                hasAvatar.value = true
            }
        }
        reader.onerror = (e) => fn('上传失败');
        reader.readAsDataURL(img)
    }
}

const showModify = ref(false);
const expend = () => {
    showModify.value = !showModify.value;
}

let verify = initNotPass & ~0;
const handlerVerify = debounce(() => {
    const pc = oldPassword.value?.component, npc = newPassword.value?.component, cpc = confirmPassword.value?.component;
    if (pc?.checkValidity() && pc.value) verify &= ~(1 << PassMap.oldPassword);
    else verify |= 1 << PassMap.oldPassword;

    if (!npc?.checkValidity()) {
        verify |= 1 << PassMap.newPassword;
        newPassword.value?.show();
    } else if (npc.value === pc?.value) {
        verify |= 1 << PassMap.newPassword;
        oldPassword.value?.show()
    } else {
        verify &= ~(1 << PassMap.newPassword);
        newPassword.value?.hide()
        oldPassword.value?.hide()
    }

    if (cpc?.checkValidity() && cpc.value === npc?.value) {
        verify &= ~(1 << PassMap.confirmPassword);
        confirmPassword.value?.hide();
    } else {
        verify |= 1 << PassMap.confirmPassword;
        confirmPassword.value?.show();
    }
}, debounceTime);

const oldPassword = ref<ICustomInput>();
const newPassword = ref<ICustomInput>();
const confirmPassword = ref<ICustomInput>();
const username = ref<ICustomInput>();
const router = useRouter();

const modifyPassword = () => {
    if (verify) {
        useToast('校验不通过');
        return Promise.reject('密码校验不通过，密码无法修改')
    }
    const np = newPassword.value?.component.value, p = oldPassword.value?.component.value;
    return updateUserPass({ newPassword: cryptoPassword(np!), password: cryptoPassword(p!) })
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg)
            return res.data
        })
}
const modifyProfile = () => {
    const remove = useLoading();
    const promises = []
    newPassword.value?.component.value && promises.push(modifyPassword());

    intro.value?.value && intro.value?.value !== userInfo?.intro && (formData.set('intro', intro.value.value));
    username.value?.component.value && username.value?.component.value !== userInfo?.username && (formData.set('username', username.value?.component.value))
    promises.push(updateUserInfo(formData, "", { headers: { "Content-Type": "multipart/form-data" } })
        .then(res => {
            if (res.code !== 200) throw new Error(res.msg)
            return res.data
        }))
    Promise.all(promises)
        .then(() => {
            remove()
            useToast('修改成功').then(() => {
                recapUserInfo()
                if (promises.length === 2) router.replace('/login'); // 说明有修改密码操作
            })
        })
        .catch(err => {
            remove()
            useToast(err.message || '网络错误');
        })
        .finally(() => {
            formData = new FormData(); // 清空
        })
}

onMounted(() => {
    intro.value && (intro.value.value = userInfo?.intro ?? "")
    username.value && (username.value.component.value = userInfo?.username ?? "")
})
</script>

<template>
    <template v-if="userInfo">
        <div class="base-info pd-20">
            <div class="avatar">
                <label for="avatar">
                    <img ref="avatar" :src="userInfo.avatarSrc || '@/assets/default.jpg'" alt="头像">
                </label>
                <input ref="file" @change="handlerFile" hidden type="file" id="avatar"
                    accept="image/png,image/jpg,image/jpeg" />
            </div>
            <CustomInput ref="username" maxlength="10" max-len="10" :placeholder="userInfo.username || '请输入用户名'" />
        </div>
        <div class="description pd-20" v-html="hasAvatar ? '点击下方保存修改生效 ' :
            '格式：支持JPG、PNG、JPEG<br>大小：4M以内'">
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
                <CustomInput @input="handlerVerify" ref="oldPassword" type="password" max-len="20" placeholder="请输入旧密码"
                    err-msg="新旧密码一致" />
                <CustomInput @input="handlerVerify" ref="newPassword" type="password" minlength="6" maxlength="20"
                    max-len="20" placeholder="请输入新密码" err-msg="长度在6~20之间" />
                <CustomInput @input="handlerVerify" ref="confirmPassword" type="password" minlength="6" maxlength="20"
                    max-len="20" placeholder="请确认新密码" err-msg="两次密码不一致" />
            </div>
        </div>
        <div class="save">
            <button @click="modifyProfile">保存</button>
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
        width: responsive(80, vh);
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