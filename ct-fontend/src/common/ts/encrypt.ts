import CryptoJS from 'crypto-js';

export function encrypt(arg: string) {
  const hash = CryptoJS.SHA256(arg);
  return hash.toString(CryptoJS.enc.Hex);
}

const symmetricKey = 'xxyCoderSocializing88080'

export function symmetricEncryption(id: string | number) {
  const cur = Date.now()
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ id, cur }), symmetricKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  return encrypted.toString()
}