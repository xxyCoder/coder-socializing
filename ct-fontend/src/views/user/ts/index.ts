import crypto from 'crypto-js'

export function cryptoPassword(password: string) {
    const hash = crypto.SHA256(password);
    return hash.toString(crypto.enc.Hex);
}

export const debounceTime = 500;

const byte = 1024;

export const MB = byte * byte;

export const InputMap = {
    username: 0,
    account: 1,
    password: 2,
    confirmPassword: 3
}

export const PassMap = {
    oldPassword: 1,
    newPassword: 2,
    confirmPassword: 3
}

export const initNotPass = 0b1111;

export const listMap = {
    0: 'note',
    1: 'like',
    2: 'collect'
} as const

export const enum userStateEnum {
    self,
    follwer,
    other
}

export const userStateMap = {
    [userStateEnum.self]: '修改信息',
    [userStateEnum.follwer]: '已关注',
    [userStateEnum.other]: '关注'
}
