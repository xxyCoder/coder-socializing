<script setup lang="ts">
import { onBeforeUnmount, onUpdated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNoteDetail, emitComment, getNoteComment, getNotifyComment } from '@/api/note'
import { useToast } from '@/components/Toast';
import { useLoading } from '@/components/Loading';
import { follwerOrCancel } from '@/api/users';
import { getUserInfo } from '@/common/ts/user-info';
import NullData from '@/components/common/null-data.vue';
import Carousel from '@/components/common/carousel.vue';
import type { UserInfo, NoteInfo, Comment } from '@/common/types/index'
import { backendStatic, ip, port } from '@/api/config';
import Like from '@/components/common/like.vue';
import Collect from '@/components/common/collect.vue';
import CommentItem from '@/components/note/comment-item.vue';
import InTheEnd from '@/components/common/in-the-end.vue';
import { ReplyInfo } from '@/common/types';
import { useNoteInfoStore } from '@/store';

const route = useRoute();
const router = useRouter();
const { id } = route.params;

const selfInfo = getUserInfo()
const note = ref<NoteInfo>()
const viewr = ref<UserInfo>()

const remove = useLoading();
getNoteDetail(`?noteId=${id}`)
    .then(({ note: _note, user }) => {
        remove();
        note.value = _note
        viewr.value = user
    })
    .catch(err => {
        remove();
        useToast(err.message);
    });


const commentListRef = ref<HTMLDivElement>()
const commentList = ref<Comment[]>([])
const commentChildList = ref<Map<number, Comment[]>>(new Map())
const commentChildPageNums: Map<number, number> = new Map()
let pageNum = 0, commentHeight = 0, startY = 0, req = true // 初始值为true因为第一次需要手动请求
const reqComment = (rootCommentId: number | null = null) => {
    let pn = pageNum;
    if (rootCommentId) {
        pn = commentChildPageNums.get(rootCommentId) || 0;
    }
    getNoteComment(`?noteId=${id}&page_num=${pn}&rootCommentId=${rootCommentId}`)
        .then(({ comments: _comments }) => {
            if (_comments.length) {
                if (rootCommentId) {
                    const arr = commentChildList.value.get(rootCommentId) || [];
                    arr.push(..._comments);
                    commentChildList.value.set(rootCommentId, arr);
                } else {
                    commentList.value.push(..._comments)
                }
                ++pn
                req = false; // 放此处同时避免没有数据了继续请求
                rootCommentId ? commentChildPageNums.set(rootCommentId, pn) : (pageNum = pn);
            }
        })
        .catch(err => {
            console.error(err);
            useToast('拉取失败')
        })
}
const { comment: { commentId }, setNoteInfo } = useNoteInfoStore()
commentId && getNotifyComment(`?commentId=${commentId}`)
    .then(({ comments: _comments }) => {
        const rootComment = _comments[0], replyComment = _comments[1], comment = _comments[2]
        commentList.value.unshift(rootComment)

        const arr = commentChildList.value.get(rootComment.id) || [];
        replyComment.id && arr.unshift(replyComment);
        comment.id && arr.unshift(comment);
        commentChildList.value.set(rootComment.id, arr);
    })
    .catch(err => {
        console.error(err)
        useToast('获取通知评论失败请重新尝试')
    })
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

    follwerOrCancel({ id: selfInfo.id, viewer_id: viewr.value.userId, is_follwer: viewr.value.isFollower })
        .then(() => {
            viewr.value && (viewr.value.isFollower = !viewr.value.isFollower);
        })
        .catch(err => {
            useToast(err.message);
        })
}

const comment = ref<string>('')
const replyInfo = ref<ReplyInfo>({ targetCommentId: null, username: '', comment: '', rootCommentId: null, replyUserId: null })
const commit = () => {
    if (!comment.value.length || !selfInfo) return;
    const noteId = note.value?.id;
    if (!noteId) {
        useToast('网络错误');
        return;
    }
    const targetCommentId = replyInfo.value.targetCommentId, rootCommentId = replyInfo.value.rootCommentId
    emitComment({ noteId, comment: comment.value, targetCommentId, rootCommentId, replyUserId: replyInfo.value.replyUserId || viewr.value?.userId })
        .then(res => {
            if (rootCommentId) {
                const arr = commentChildList.value.get(rootCommentId) || [];
                arr.unshift({ ...res, replyUsername: targetCommentId === rootCommentId ? "" : replyInfo.value.username, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } });
                commentChildList.value.set(rootCommentId, arr)
            } else {
                commentList.value.unshift({ ...res, user: { userId: selfInfo.id, username: selfInfo.username, avatarSrc: selfInfo.avatarSrc } })
            }
            comment.value = ''
        })
        .catch(err => {
            useToast(err.message);
        })
    replyInfo.value.targetCommentId = replyInfo.value.rootCommentId = null;
}

const handlerReply = (info: ReplyInfo) => {
    replyInfo.value = info
}

const cancelReply = () => {
    replyInfo.value.targetCommentId = null
    comment.value = ''
}

onUpdated(() => {
    commentHeight = commentListRef.value?.getBoundingClientRect().height || 0
})
onBeforeUnmount(() => {
    setNoteInfo({ replyCommentId: null, commentId: null, rootCommentId: null })
})
</script>

<template>
    <template v-if="note && viewr">
        <header class="author-wrapper">
            <div class="author-info">
                <span class="close" @click="router.back">+</span>
                <img :src="viewr.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="avatar">
                <span>{{ viewr.username }}</span>
            </div>
            <button v-if="viewr.userId !== selfInfo?.id" class="follower-btn" @click="handlerClick">{{ viewr.isFollower ? '取消关注' : '关注' }}</button>
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
                    :date="new Date(item.createdAt).toDateString()" :comment-id="item.id" :reply-cnt="item.replyCnt"
                    :user-id="item.user.userId" :reply-comments="commentChildList.get(item.id)" @reply="handlerReply"
                    @extend="reqComment" />
                <in-the-end />
            </div>
        </div>
        <div class="interaction">
            <div class="reply-box" v-show="replyInfo.targetCommentId">
                <div class="flex-box">
                    <span>回复 {{ replyInfo.username }}</span>
                    <button @click="cancelReply">取消</button>
                </div>
                <p>{{ replyInfo.comment }}</p>
            </div>
            <div class="flex-box">
                <input class="comment" v-model="comment" type="text" placeholder="评论" />
                <button class="btn" @click="commit">发送</button>
                <div class="opts">
                    <like :is-like="note.isLike" :likeCnt="note.likeCnt" :note-id="note.id" :author-id="viewr.userId" />
                    <collect :is-collect="note.isCollect" :collect-cnt="note.collectCnt" :author-id="viewr.userId"
                        :note-id="note.id" />
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
