interface UserInfo {
    avatarSrc?: string;
    intro?: string;
    username: string;
}

let _userInfo: UserInfo;

export function setUserInfo(userInfo: UserInfo) {
    _userInfo = userInfo;
}

export function getUserInfo() {
    return _userInfo;
}