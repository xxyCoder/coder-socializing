import express from 'express';
import multer from 'multer';
import { checkFormParams, crpytPassword, checkPassParams, checkIdAndAccountExists, checkViewIdExists } from '@src/middleware/users.middleware';
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware';
import UsersController from "@src/controller/users.controller"
import { checkPageParams } from '@src/middleware/common.middleware';
import { storage } from '@src/middleware/common.middleware'

const { registry, login, getSelfInfo, uploadPass, uploadInfo, getViewerInfo, quit } = UsersController;

const router = express.Router();

router.post("/registry", checkFormParams, crpytPassword, registry);
router.post("/login", checkFormParams, login);
router.post('/quit', verifyToken, verifyCSRFSession, quit)
// 拿到用户个人信息
router.get("/info", checkIdAndAccountExists, verifyToken, verifyCSRFSession, getSelfInfo);
// 修改密码
router.post("/update_pass", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkPassParams, crpytPassword, uploadPass);

// 修改个人信息
const upload = multer({ storage });
router.post("/update_userinfo", checkIdAndAccountExists, verifyToken, verifyCSRFSession, upload.single('avatarSrc'), uploadInfo)

// 分页获取
router.get('/dynamic_datas', checkPageParams)
// 拿到被观察者用户信息
router.get('/user_info', checkViewIdExists, checkPageParams, getViewerInfo)

export default router;