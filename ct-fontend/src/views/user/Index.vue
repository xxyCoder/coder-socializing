<script setup lang="ts">
import { ComponentInternalInstance, computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { listMap, userStateMap, userStateEnum, userOptMap } from './ts/index';
import { ip, port, backendStatic } from '@/api/constant';
import { getViewerInfo, searchUser, signOut } from '@/api/users';
import { getViewerNote } from '@/api/note'
import { follwerOrCancel } from '@/api/users'
import { useLoading } from '@/components/Loading';
import { getUserInfo } from '@/common/ts/user-info';
import { useToast } from '@/components/Toast';
import type { NoteCardType } from '@/common/types'
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

const list = ['笔记', '点赞', '收藏'];
const pageNumObj = {
  note: 0,
  like: 0,
  collect: 0
}
const cards = reactive<{ note: NoteCardType[], like: NoteCardType[], collect: NoteCardType[] }>({
  note: [],
  like: [],
  collect: [],
})
function chooseGetOrStore({ idx, getQuery = false, cardData }: { idx: 0 | 1 | 2, getQuery?: boolean, cardData?: NoteCardType[] }) {
  let name = listMap[idx]
  if (getQuery) return pageNumObj[name]
  ++pageNumObj[name]
  cardData && (cards[name].push(...cardData))

  return cards[name]
}

const userExists = ref(true)
const userInfo = reactive({ username: "", avatarSrc: "", intro: "这个人没有个人介绍", isFollower: false, userId: Number(route.params.id) });
const showInfos = ref<NoteCardType[]>([]);

const getInfo = () => {
  const remove = useLoading()
  getViewerInfo({
    viewer_id: route.params.id,
    page_num: pageNumObj.note,
    category: listMap[0]
  })
    .then(res => {
      remove();
      ++pageNumObj.note;
      const { notes: _notes, avatarSrc, username, intro, isFollower } = res;
      chooseGetOrStore({ idx: 0, cardData: _notes })
      showInfos.value = _notes;
      userInfo.avatarSrc = avatarSrc
      userInfo.intro = intro
      userInfo.username = username
      userInfo.isFollower = isFollower
    })
    .catch(() => {
      remove();
      userExists.value = false;
    })

}
watch(() => route.params.id, () => {
  pageNumObj.note = 0
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
    signOut({})
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

const reqListData = (idx: 0 | 1 | 2) => {
  const remove = useLoading()
  showInfos.value = []

  getViewerNote({
    viewer_id: route.params.id,
    category: listMap[idx],
    page_num: chooseGetOrStore({ idx, getQuery: true })
  })
    .then(res => {
      chooseGetOrStore({ idx, cardData: res.notes })
    })
    .finally(() => {
      remove()
      showInfos.value = chooseGetOrStore({ idx }) as NoteCardType[]
    })
}

const recKey = 'user-search-record-list'
let page_num = 0
let instance: null | ComponentInternalInstance = null;
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
        instance = createComponentAPI(PanelToast, {
          users: res.users, onNeedMore: () => {
            if (page_num === -1) return
            searchUser({ user: searchConn, page_num })
          }
        })
      }
      if (instance) {
        // @ts-ignore
        instance.exposed.show()
        instance.props.users = res.users
      }
    })
}
</script>

<template>
  <search-panel :rec-key="recKey" @search="handlerSearch" tips="搜索用户" />
  <div v-if="userExists" class="container pt-120">
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
    <p class="intro">{{ userInfo.intro || '这个人没有个人介绍' }}</p>
    <div class="user-interactions"></div>
  </div>
  <sticky-list :list="list" @click="reqListData" />
  <all-notes :show-infos="showInfos" />
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

.opt {
  display: flex;
  flex-direction: column;
  row-gap: 3px;
}

.pt-120 {
  padding-top: responsive(120, vw);
}
</style>
