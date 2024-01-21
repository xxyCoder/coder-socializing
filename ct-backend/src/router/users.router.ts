import express from 'express';
import multer from 'multer';
import path from 'path';
import { checkFormParams, crpytPassword, checkPassParams, checkIdAndAccountExists } from '@src/middleware/users.middleware';
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware';
import UsersController from "@src/controller/users.controller"


const { registry, login, getSelfInfo, uploadPass, uploadInfo } = UsersController;

const router = express.Router();

router.post("/registry", checkFormParams, crpytPassword, registry);
router.post("/login", checkFormParams, login);
// 拿到用户个人信息
router.get("/info", checkIdAndAccountExists, verifyToken, getSelfInfo);
// 修改密码
router.post("/update_pass", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkPassParams, crpytPassword, uploadPass);

// 修改个人信息
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

router.post("/update_userinfo", checkIdAndAccountExists, verifyToken, verifyCSRFSession, upload.single('avatarSrc'), uploadInfo)

export default router;