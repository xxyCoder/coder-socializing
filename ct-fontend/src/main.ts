import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { recapUserInfo } from './common/ts/user-info'

recapUserInfo()
createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
