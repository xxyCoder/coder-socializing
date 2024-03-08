import { ip, port } from "@/api/config";
import { getUserInfo as getUserInfoApi } from "@/api/users";

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
                console.log(event.data, 'rec')
            }
            eventSource.onerror = (error) => {
                console.error(`sse error: ${error}`)
            }
            // 获取评论、点赞和关注的通知
        })
        .catch(err => {
            // 清空localStorage信息
            localStorage.removeItem('user-info')
            // 埋点
        })
}
