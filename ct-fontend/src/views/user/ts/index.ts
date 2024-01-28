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

export interface ICustomInput {
    component: HTMLInputElement,
    show: () => void;
    hide: () => void;
}

export const pageSize = 20;

export const tabName: { [key: number]: string } = {
    0: 'like'
}