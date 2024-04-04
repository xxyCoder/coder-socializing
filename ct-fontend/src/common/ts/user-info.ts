import { ip, port } from "@/api/config";
import { getUserInfo as getUserInfoApi } from "@/api/users";
import { useToast } from "@/components/Toast";
import { useNotityCountStore } from "@/store";

export interface UserInfo {
    avatarSrc?: string;
    intro?: string;
    username: string;
    id: number;
    account: string;
}

let _userInfo: UserInfo | null = null;

export function setUserInfo(userInfo: UserInfo | null) {
    _userInfo = userInfo;
}

export function getUserInfo() {
    return _userInfo;
}

let eventSource
export function recapUserInfo() {
    getUserInfoApi("")
        .then(res => {
            setUserInfo(res)
            // 建立sse连接
            eventSource = new EventSource(`${ip}:${port}/sse/${res.id}`)
            eventSource.onmessage = (event) => {
                const { type } = JSON.parse(event.data);
                console.log(event.data)
                if (type === 'notify') {
                    const { addCount } = useNotityCountStore()
                    addCount()
                }
            }
            eventSource.onerror = (error) => {
                console.error(`sse error: ${error}`)
            }
            // 获取评论、点赞和关注的通知
        })
        .catch(() => {
            // 清空localStorage信息
            useToast('请登录')
            localStorage.removeItem('user-info')
            // 埋点
        })
}
