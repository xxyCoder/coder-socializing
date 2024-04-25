import { importArgsIsNull } from "@src/constant/resp.constant";
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

export const checkPageParams = (req: Request, res: Response, next: NextFunction) => {
  const { page_num } = req.query;
  if (!page_num) {
    res.send(importArgsIsNull);
    return;
  }
  next()
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