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

export function recapUserInfo() {
    getUserInfoApi("")
        .then(res => {
            setUserInfo(res)
        })
        .catch(err => {
            // 清空localStorage信息
            localStorage.removeItem('user-info')
            // 埋点
        })
}
