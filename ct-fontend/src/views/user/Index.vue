<script setup lang="ts">
import { ComponentInternalInstance, computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listMap, userStateMap, userStateEnum, userOptMap, Follow } from './ts/index';
import { ip, port, backendStatic } from '@/api/constant';
import { getFollowers, getViewerInfo, searchUser, signOut } from '@/api/users';
import { getViewerNote } from '@/api/note'
import { follwerOrCancel } from '@/api/users'
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import type { NoteCardType } from '@/common/types'
import InfoItem from '@/components/user/info-item.vue'
import BottomMenu from '@/components/common/bottom-menu.vue';
import StickyList from '@/components/common/sticky-list.vue';
import AllNotes from '@/components/note/all-notes.vue';
import SearchPanel from '@/components/common/search-panel.vue';
import PanelToast from '@/components/user/panel-toast.vue';
import { useviewerStore } from '@/store';
import { createComponentAPI } from '@/common/ts/create-component-API';

const route = useRoute();
const router = useRouter()
const selfInfo = getUserInfo();

let instance: null | ComponentInternalInstance = null;
let unmount: () => void = () => {
  // empty
}
onBeforeUnmount(() => {
  if (instance) {
    // @ts-ignore
    instance.exposed.hide()
    unmount()
  }
})

const list = ['笔记', '点赞', '收藏'];
const pageNumObj = {
  note: 0,
  like: 0,
  collect: 0
}

const userInfo = reactive({ username: "", avatarSrc: "", intro: "这个人没有个人介绍", isFollower: false, userId: 0 });
const showInfos = ref<NoteCardType[]>([]);

const getInfo = () => {
  const remove = useLoading()

  getViewerInfo({
    viewer_id: route.params.id,
    page_num: pageNumObj.note,
    category: listMap[0]
  })
    .then(res => {
      ++pageNumObj.note;
      const { notes: _notes, avatarSrc, username, intro, isFollower } = res;
      showInfos.value = _notes

      userInfo.avatarSrc = avatarSrc
      userInfo.intro = intro
      userInfo.username = username
      userInfo.isFollower = isFollower
      userInfo.userId = Number(route.params.id)
    })
    .finally(() => {
      remove()
    })

}
watch(() => route.params.id, () => {
  if (!route.params.id) return
  pageNumObj.note = pageNumObj.like = pageNumObj.collect = 0
  getInfo()
}, { immediate: true })

const userState = computed(() => {
  if (Number(route.params.id) === selfInfo?.id) return userStateEnum.self
  return userInfo.isFollower ? userStateEnum.follwer : userStateEnum.other;
});
const handlerClick = () => {
  if (!selfInfo || !selfInfo.id) return;
  switch (userState.value) {
    case userStateEnum.self: router.push('/user-info'); break;
    case userStateEnum.follwer:
    case userStateEnum.other:
      follwerOrCancel({ id: selfInfo.id, viewer_id: String(route.params.id), is_follwer: userInfo.isFollower })
        .then(() => {
          userInfo.isFollower = !userInfo.isFollower;
        })
      break;
  }
};

const handlerOpt = () => {
  if (userState.value === userStateEnum.self) {
    signOut()
    localStorage.removeItem('user-info')
    router.replace('/login')
    return
  }
  if (!selfInfo?.id) {
    useToast('请先登录')
    return
  }
  useviewerStore().setViewerInfo(userInfo)
  router.push(`/chat/${route.params.id}`)
}

let lastIdx: 0 | 1 | 2 = 0
const reqListData = (idx: 0 | 1 | 2) => {
  if (idx !== lastIdx) {
    showInfos.value = []
    lastIdx = idx
    pageNumObj[listMap[idx]] = 0
  }
  const name = listMap[idx]
  if (pageNumObj[name] < 0) return
  const remove = useLoading()
  getViewerNote({
    viewer_id: route.params.id,
    category: listMap[idx],
    page_num: pageNumObj[name]
  })
    .then(res => {
      showInfos.value.push(...res.notes)
      ++pageNumObj[name]
      if (!res.notes.length) {
        pageNumObj[name] = -1
      }
    })
    .finally(() => {
      remove()
    })
}

const recKey = 'user-search-record-list'
let page_num = 0

const handlerSearch = (searchConn: string) => {
  if (!searchConn) return
  page_num = 0
  searchUser({ user: encodeURIComponent(searchConn), page_num })
    .then(res => {
      ++page_num
      if (!res.users.length) {
        page_num = -1 // 没有数据了
      }
      if (!instance) {
        ({ instance, unmount } = createComponentAPI(PanelToast, {
          users: res.users, onNeedMore: () => {
            if (page_num === -1) return
            searchUser({ user: searchConn, page_num })
          }
        }))
      }
      if (instance) {
        // @ts-ignore
        instance.exposed.show()
        instance.props.users = res.users
      }
    })
}

const followed = ref(0)
const follower = ref(0)
getFollowers()
  .then(res => {
    followed.value = res.followed
    follower.value = res.follower
  })
  .catch(err => {
    console.log(err)
  })

function handlerInteraction(idx: number) {
  router.push({ path: '/follow', query: { idx } })
}
</script>

<template>
  <search-panel :rec-key="recKey" @search="handlerSearch" tips="搜索用户" />
  <div v-if="userInfo.userId" class="container pt-120">
    <div class="info center">
      <div class="center">
        <img :src="userInfo.avatarSrc || `${ip}:${port}${backendStatic}/default.jpg`" alt="头像" />
        <div class="info-right">
          <div>{{ userInfo.username }}</div>
          <span>ct号：{{ route.params.id }}</span>
        </div>
      </div>
      <div class="opt">
        <button class="user-state" @click="handlerClick">{{ userStateMap[userState] }}</button>
        <button class="user-state" @click="handlerOpt">{{ userOptMap[userState] }}</button>
      </div>
    </div>
    <div class="user-interactions">
      <info-item :count="follower" info="关注者" @click="handlerInteraction(Follow.follower)" />
      <info-item :count="followed" info="粉丝" @click="handlerInteraction(Follow.followed)" />
    </div>
    <p class="intro">{{ userInfo.intro || '这个人没有个人介绍' }}</p>
  </div>
  <sticky-list :list="list" @click="reqListData" />
  <all-notes :show-infos="showInfos" @req-notes="reqListData(lastIdx)" />
  <bottom-menu />
</template>

<style scoped lang="scss">
@import '../../common/style/global.scss';
@import '../../common/style/func.scss';

.center {
  display: flex;
  align-items: center;
}

.info {
  justify-content: space-between;

  img {
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 50%;
  }

  .info-right {
    margin-left: 16px;

    div {
      font-size: 18px;
    }

    span {
      font-size: 12px;
      color: hsla(0, 0%, 100%, 0.6);
    }
  }
}

.intro {
  font-size: 14px;
  white-space: pre-line;
}

.user-state {
  border: 1px solid #1e80ff;
  border-radius: 5px;
  padding: responsive(8, vh) responsive(20, vh);
  background-color: transparent;
  color: #fff;
}

.user-interactions {
  display: flex;
}

.opt {
  display: flex;
  flex-direction: column;
  row-gap: 3px;
}

.pt-120 {
  padding-top: responsive(120, vw);
}
</style>
