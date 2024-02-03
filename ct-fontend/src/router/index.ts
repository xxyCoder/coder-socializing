import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
    path: '/publish',
    component: () => import('@/views/note/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
