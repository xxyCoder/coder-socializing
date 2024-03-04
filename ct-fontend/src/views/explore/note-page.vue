<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNoteDetail, emitComment, getNoteComment } from '@/api/note'
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';
import { follwerOrCancel } from '@/api/users';
import { getUserInfo } from '@/common/ts/user-info';
import NullData from '@/components/null-data.vue';
import Carousel from '@/components/carousel.vue';
import type { UserInfo, NoteInfo, Comment } from '@/common/types/index'
import { backendStatic, ip, port } from '@/api/config';
import Like from '@/components/like.vue';
import Collect from '@/components/collect.vue';
import CommentItem from '@/components/note/comment-item.vue';
import InTheEnd from '@/components/common/in-the-end.vue';
import { ReplyInfo } from '@/common/types';

const route = useRoute();
const router = useRouter();
const { id } = route.params;

const selfInfo = getUserInfo()
const note = ref<NoteInfo>()
const viewr = ref<UserInfo>()
const isLike = ref(false)
const likeCnt = ref(0)
const isCollect = ref(false)
const collectCnt = ref(0)

const remove = useLoading();
getNoteDetail(`?noteId=${id}`)
    .then(({ note: _note, user }) => {
        remove();
        note.value = _note
        isLike.value = _note.isLike || false
        isCollect.value = _note.isCollect || false
        likeCnt.value = _note.likeCnt || 0
        collectCnt.value = _note.collectCnt || 0
        viewr.value = user
    })
    .catch(err => {
        remove();
        useToast(err.message);
    });

const commentListRef = ref<HTMLDivElement>()
const commentList = ref<Comment[]>([])
const commentChildList = ref<Map<number, Comment[]>>(new Map())
let pageNum = 0, commentHeight = 0, startY = 0, req = true // 初始值为true因为第一次需要手动请求
const reqComment = (targetCommentId: number | null = null) => {
    getNoteComment(`?noteId=${id}&page_num=${pageNum}&targetCommentId=${targetCommentId}`)
        .then(({ comments: _comments }) => {
            if (_comments.length) {
                _comments.forEach(({ childs, ...others }) => {
                    if (targetCommentId) {
                        const arr = commentChildList.value.get(targetCommentId) || [];
                        arr.push(others)
                        commentChildList.value.set(targetCommentId, arr);
                    } else {
                        commentList.value.push(others)
                    }

                    if (childs && childs.length) {
                        const id = others.id
                        const arr = commentChildList.value.get(id) || [];
                        arr.push(...childs);
                        commentChildList.value.set(id, arr);
                    }
                })
                ++pageNum, commentHeight = commentListRef.value?.getBoundingClientRect().height || 0
                req = false; // 放此处同时避免没有数据了继续请求
            }
            console.log(commentList.value)
        })
}
reqComment();
const handlerTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].pageY;
}
const handlerTouchMove = (e: TouchEvent) => {
    const endY = 2 * startY - e.touches[0].pageY;
    if (endY + 200 >= commentHeight && !req) {
        req = true;
        reqComment();
    }
}


const handlerClick = () => {
    if (!selfInfo || !selfInfo.id) {
        useToast('请先登录~');
        return
    }

    if (!viewr.value) {
        useToast('出错了~');
        return;
    }

    follwerOrCancel({ id: String(selfInfo.id), viewer_id: String(viewr.value.userId), is_follwer: String(viewr.value.isFollower) })
        .then(res => {
            viewr.value && (viewr.value.isFollower = !viewr.value.isFollower);
        })
        .catch(err => {
            useToast(err.message);
        })
}

const comment = ref<string>('')
const replyInfo = ref<ReplyInfo>({ targetCommentId: null, username: '', comment: '', isRoot: true })
const commit = () => {
    if (!comment.value.length || !selfInfo) return;
    const noteId = note.value?.id;
    if (!noteId) {
        useToast('网络错误');
        return;
    }
    const targetCommentId = replyInfo.value.targetCommentId
    emitComment({ noteId, comment: comment.value, targetCommentId })
        .then(res => {
            if (targetCommentId) {
                const arr = commentChildList.value.get(targetCommentId) || [];
                arr.unshift({ ...res, replyUsername: replyInfo.value.isRoot ? "" : replyInfo.value.username, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } });
                commentChildList.value.set(targetCommentId, arr)
            } else {
                commentList.value.unshift({ ...res, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } })
            }
            comment.value = ''
        })
        .catch(err => {
            useToast(err.message);
        })
    replyInfo.value.targetCommentId = null
}

const handlerReply = (info: ReplyInfo) => {
    replyInfo.value = info
}

const handlerOpt = (type: 'like' | 'collect') => {
    type === 'like' ?
        (isLike.value = !isLike.value, isLike.value ? ++likeCnt.value : --likeCnt.value) :
        (isCollect.value = !isCollect.value, isCollect.value ? ++collectCnt.value : --collectCnt.value);

}
</script>

<template>
    <template v-if="note && viewr">
        <header class="author-wrapper">
            <div class="author-info">
                <span class="close" @click="router.back">+</span>
                <img :src="viewr.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="avatar">
                <span>{{ viewr.username }}</span>
            </div>
            <button class="follower-btn" @click="handlerClick">{{ viewr.isFollower ? '取消关注' : '关注' }}</button>
        </header>
        <div class="note-page container" @touchstart="handlerTouchStart" @touchmove="handlerTouchMove">
            <div class="media-box">
                <video v-if="note.isVideo" :src="note.mediaList" controls></video>
                <carousel v-else :list="note.mediaList.split(';')" />
            </div>
            <div>
                <h3 class="title">{{ note.title }}</h3>
                <p class="content">{{ note.content }}</p>
                <span class="time">
                    {{ (note.updateDate === note.createDate ? '发布于' : '编辑于') +
        ' ' +
        new Date(note.updateDate).toLocaleString() }}
                </span>
            </div>
            <div ref="commentListRef" class="comments">
                <comment-item v-for="item in commentList" :key="item.id" :username="item.user.username"
                    :avatar-src="item.user.avatarSrc" :content="item.content" :comment-cnt="item.replies"
                    :date="new Date(item.createdAt).toDateString()" :comment-id="item.id"
                    :reply-comments="commentChildList.get(item.id)" @reply="handlerReply" />
                <in-the-end />
            </div>
        </div>
        <div class="interaction">
            <div class="reply-box" v-show="replyInfo.targetCommentId">
                <div class="flex-box">
                    <span>回复 {{ replyInfo.username }}</span>
                    <button @click="replyInfo.targetCommentId = null">取消</button>
                </div>
                <p>{{ replyInfo.comment }}</p>
            </div>
            <div class="flex-box">
                <input class="comment" v-model="comment" type="text" placeholder="评论" />
                <button class="btn" @click="commit">发送</button>
                <div class="opts">
                    <like :is-like="isLike" :likeCnt="likeCnt" :note-id="note.id" @like="handlerOpt('like')" />
                    <collect :is-collect="isCollect" :collect-cnt="collectCnt" :note-id="note.id"
                        @collect="handlerOpt('collect')" />
                </div>
            </div>
        </div>
    </template>
    <null-data v-else />
</template>

<style scoped lang="scss">
@import '../../common/style/func.scss';
@import '../../common/style/global.scss';

.author-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1.25rem;
    position: sticky;
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

.media-box {
    video {
        width: 100%;
    }
}

.content {
    font-size: 14px;
}

.time {
    color: hsla(0, 0%, 100%, 0.6);
    font-size: 12px;
}

.interaction {
    position: fixed;
    box-sizing: border-box;
    padding: responsive(12, vh) responsive(24, vw);
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
}

.reply-box {
    box-sizing: border-box;
    font-size: 14px;

    div {
        color: hsla(0, 0%, 100%, 0.6)
    }

    button {
        border: none;
        border-radius: responsive(20, vw);
        padding: responsive(6, vh) responsive(20, vw);
        background-color: #1e80ff;
        color: #fff;
    }

    p {
        color: hsla(0, 0%, 100%, 0.8);
        overflow: hidden;
        text-overflow: ellipsis;
        text-wrap: nowrap;
    }
}

.flex-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.comments {
    margin: 10px 0 responsive(100, vw);
}

.comment {
    border: none;
    margin-right: 5px;
    padding: responsive(12, vh) responsive(24, vw);
    border-radius: responsive(12, vh);
    color: hsla(0, 0%, 100%, 0.6);
    background-color: hsla(0, 0%, 100%, 0.1);
    outline: none;
    flex: 1;
}

.btn {
    border: none;
    background-color: #1e80ff;
    color: #fff;
    padding: 4px 12px;
    border-radius: 4px;
}

.opts {
    display: flex;
    align-items: center;
}
</style>
