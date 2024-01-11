import crypto from 'crypto-js'

export function cryptoPassword(password: string) {
    const hash = crypto.SHA256(password);
    return hash.toString(crypto.enc.Hex);
}

export const debounceTime = 500;

export const InputMap = {
    username: 0,
    account: 1,
    password: 2,
    confirmPassword: 3
}

export const initNotPass = 0b1111