import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { recapUserInfo } from './common/ts/user-info'

recapUserInfo()
createApp(App).use(router).mount('#app')
