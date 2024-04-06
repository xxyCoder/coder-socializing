import { getUserInfo as getUserInfoApi } from "@/api/users";
import { useToast } from "@/components/Toast";
import { useEventSource } from "./correspondence";


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

export function recapUserInfo() {
    getUserInfoApi("")
        .then(res => {
            setUserInfo(res)
            useEventSource(res.id)
        })
        .catch(() => {
            // 清空localStorage信息
            useToast('请登录')
            localStorage.removeItem('user-info')
            // 埋点
        })
}
