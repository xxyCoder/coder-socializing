import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { getUserInfo } from './api/users'
import { setUserInfo } from './common/ts/user-info'
import { useToast } from './components/Toast'

getUserInfo("")
    .then(res => {
        if (res.code !== 200) throw new Error(res.msg);
        setUserInfo(res.data!)
    })
    .catch(err => {
        useToast(err.message || "网络错误");
        // 埋点
    })
createApp(App).use(router).mount('#app')
