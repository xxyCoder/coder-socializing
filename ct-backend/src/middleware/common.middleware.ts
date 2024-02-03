import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

export const categories = ['like', 'note'] as const;

type ArrayToUnion<T extends readonly string[]> = T[number];

export type CategoriesUnion = ArrayToUnion<typeof categories>;

export const checkPageParams = (req: Request, res: Response, next: NextFunction) => {
    const { page_num, page_size, category } = req.query;
    if (!page_num || !page_size || !category) {
        res.send(importArgsIsNull);
        return;
    }
    for (const c of categories) {
        if (c === category) {
            next();
            return;
        }
    }
    res.send({ code: 400, msg: '类型错误' });
}

export const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
})
