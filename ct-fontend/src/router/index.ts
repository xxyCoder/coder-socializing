import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/explore'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/user/Login.vue")
  },
  {
    path: "/registration",
    name: "registration",
    component: () => import("@/views/user/Registration.vue")
  },
  {
    path: "/user/:id",
    component: () => import("@/views/user/Index.vue"),
  },
  {
    path: "/user-info",
    component: () => import("@/views/user/Info.vue")
  },
  {
    path: "/follow",
    component: () => import("@/views/user/follow-page.vue"),
    props: (to) => ({ idx: Number(to.query.idx), viewerId: Number(to.query.viewerId) })
  },
  {
    path: '/publish',
    component: () => import('@/views/note/index.vue')
  },
  {
    path: '/notification',
    component: () => import('@/views/notification/index.vue')
  },
  {
    path: '/chat/:recevierId',
    component: () => import('@/views/notification/chat-page.vue')
  },
  {
    path: '/message',
    props(to) {
      return {
        tag: to.query.tag
      }
    },
    component: () => import('@/views/notification/message.vue')
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/explore/index.vue')
  },
  {
    path: '/explore/:id',
    component: () => import('@/views/explore/note-page.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
