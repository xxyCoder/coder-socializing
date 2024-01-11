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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
