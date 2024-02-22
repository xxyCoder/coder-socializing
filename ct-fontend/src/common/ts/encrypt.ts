import crypto from 'crypto-js'

export function encrypt(arg: string) {
    const hash = crypto.SHA256(arg);
    return hash.toString(crypto.enc.Hex);
}

export function readCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0, len = cookies.length; i < len; ++i) {
        const cookie = cookies[i], idx = cookie.indexOf('=');
        const cname = cookie.slice(0, idx), cvalue = cookie.slice(idx + 1);
        if (cname === name) return cvalue
    }
}