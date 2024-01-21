import express from 'express'
import { checkFormParams, crpytPassword, checkPassParams, checkIdAndAccountExists } from '@src/middleware/users.middleware';
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware';
import UsersController from "@src/controller/users.controller"


const { registry, login, getSelfInfo, uploadPass } = UsersController;

const router = express.Router();

router.post("/registry", checkFormParams, crpytPassword, registry);
router.post("/login", checkFormParams, login);
// 拿到用户个人信息
router.get("/info", checkIdAndAccountExists, verifyToken, getSelfInfo)
// 修改密码
router.post("/update_pass", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkPassParams, crpytPassword, uploadPass)

export default router;