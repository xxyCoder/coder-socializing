import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import jwt from 'jsonwebtoken'
import path from "path";
import env from "@src/config/default.config"

const { CSRF_SECRET } = env;

export enum categories {
    note = 'note',
    like = 'like'
}

export const setCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    res.cookie('csrf_session', jwt.sign({ pname: 'coder-socializing' }, CSRF_SECRET!))
    next()
}

export const checkPageParams = (req: Request, res: Response, next: NextFunction) => {
    const { page_num, page_size, category } = req.query;
    if (!page_num || !page_size || !category) {
        res.send(importArgsIsNull);
        return;
    }

    (category as string) in categories ? next() : res.send({ code: 400, msg: '类型错误' });
}

export const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

export const checkViewerId = (req: Request, res: Response, next: NextFunction) => {
    const { viewer_id } = req.query;
    if (Number.isNaN(Number(viewer_id))) {
        res.send(importArgsIsNull)
        return
    }
    next()
}