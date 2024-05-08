import { getUserInfo as getUserInfoApi } from "@/api/users";
import { useEventSource } from "./correspondence";
import { setNotifyCnt } from "./notify";

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
  getUserInfoApi()
    .then(res => {
      setUserInfo(res)
      useEventSource(res.id)
      setNotifyCnt()
    })
    .catch(() => {
      localStorage.removeItem('user-info')
    })
}
