import crypto from 'crypto-js'

export function encrypt(arg: string) {
    const hash = crypto.SHA256(arg);
    return hash.toString(crypto.enc.Hex);
}