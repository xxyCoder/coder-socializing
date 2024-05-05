import type { NextFunction, Request, Response } from "express";
import CryptoJS from "crypto-js";
import jwt from 'jsonwebtoken'
import env from "@src/config/default.config"
import { csrfSessionError, csrfSessionIsNull, tokenIsNull, tokenLapse, tokenTimeout } from "@src/constant/resp.constant";
import { SECOND } from "@src/constant";

const { SYMMETRIKEY, SECRET } = env;

export function verifyToken(req: Request, resp: Response, next: NextFunction) {
  const token = req.cookies["ct_token"];
  if (!token) {
    resp.send(tokenIsNull)
    return;
  }
  try {
    const user = jwt.verify(token, SECRET!) as { id: number }
    if (Number(req.query.id) === Number(user.id)) {
      req.body.id = Number(user.id)
      next()
      return
    }
    resp.send({ code: 400, msg: '身份验证错误' })
  } catch (err: any) {
    switch (err.name) {
      case 'TokenExpiredError':
        resp.send(tokenTimeout);
        break;
      case 'JsonWebTokenError':
        resp.send(tokenLapse);
        break;
    }
  }
}

function symmetricalDecryption(token: string) {
  const decrypt = CryptoJS.AES.decrypt(token, SYMMETRIKEY!, {
    "mode": CryptoJS.mode.ECB,
    "padding": CryptoJS.pad.Pkcs7
  });

  return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt));
}

const timeoutLimit = 4 * SECOND
export function verifyCSRFSession(req: Request, resp: Response, next: NextFunction) {
  const csrf_token = req.get('X-CSRF-TOKEN');
  const { id } = req.query;

  if (!csrf_token) {
    resp.send(csrfSessionIsNull);
    return;
  }
  const tokenObj = symmetricalDecryption(csrf_token)
  const cur = Date.now()

  if (tokenObj.id !== Number(id) || cur - tokenObj.cur > timeoutLimit) {
    resp.send(csrfSessionError)
    return
  }

  next()
}
