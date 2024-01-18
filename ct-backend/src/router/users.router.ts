import { checkAllParamsIsNull, checkFormParams, checkIdAndPassExists, checkPageParams, crpytPassword } from '@src/middleware/users.middleware';
import UsersController from "@src/controller/users.controller"
import express from 'express'
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware';

const { registry, login, modify, logout, search, getSelfInfo } = UsersController;

const router = express.Router();

router.post("/registry", checkFormParams, crpytPassword, registry);
router.post("/login", checkFormParams, login);
// 修改个人信息
router.post("", verifyToken, verifyCSRFSession, checkIdAndPassExists, checkAllParamsIsNull, modify);
// 注销个人信息
router.delete("", verifyToken, verifyCSRFSession, checkIdAndPassExists, logout);
// 查询用户
router.get("", checkPageParams, search);
// 拿到用户个人信息
router.get("/info", verifyToken, getSelfInfo)

export default router;