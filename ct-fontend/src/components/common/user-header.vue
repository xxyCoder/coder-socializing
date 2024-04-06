<script setup lang="ts">
import { PropType, defineProps } from 'vue'
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '../Toast';
import { UserInfo } from '@/common/types';
import { follwerOrCancel } from '@/api/users';
import { useRouter } from 'vue-router';
import { backendStatic, ip, port } from '@/api/config';

const props = defineProps({
    user: {
        type: Object as PropType<UserInfo>,
        default() {
            return {}
        }
    }
})
const router = useRouter()

const selfInfo = getUserInfo()
const handlerClick = () => {
    if (!selfInfo || !selfInfo.id) {
        useToast('请先登录~');
        return
    }

    if (!props.user) {
        useToast('出错了~');
        return;
    }

    follwerOrCancel({ id: selfInfo.id, viewer_id: props.user.userId, is_follwer: props.user.isFollower })
        .then(() => {
            // eslint-disable-next-line
            /* eslint-disable */
            props.user.isFollower = !props.user.isFollower
        })
        .catch(err => {
            useToast(err.message);
        })
}
</script>

<template>
    <header class="author-wrapper">
        <div class="author-info">
            <span class="close" @click="router.back">+</span>
            <img :src="user.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
            <span @click="router.push(`/user/${user.userId}`)">{{ user.username }}</span>
        </div>
        <button v-if="user.userId !== selfInfo?.id" class="follower-btn" @click="handlerClick">
            {{ user.isFollower ? '取消关注' : '关注' }}
        </button>
    </header>
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';

.author-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    background-color: #000;
}

.author-info {
    display: flex;
    align-items: center;

    img {
        width: responsive(60, vw);
        height: responsive(60, vw);
        border-radius: 50%;
        margin: 0 5px;
    }
}

.close {
    display: inline-block;
    font-size: responsive(80, vw);
    font-weight: 100;
    transform: rotateZ(45deg);
    color: hsla(0, 0%, 100%, 0.8);
}

.follower-btn {
    border: none;
    border-radius: responsive(40, vw);
    padding: responsive(12, vh) responsive(40, vw);
    background-color: #1e80ff;
    color: #fff;
}
</style>
