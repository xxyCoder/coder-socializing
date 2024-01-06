import { auth, checkAllParamsIsNull, checkFormParams, checkIdAndPassExists, checkPageParams, crpytPassword } from '@src/middleware/users.middleware';
import UsersController from "@src/controller/users.controller"
import express from 'express'

const { registry, login, modify, logout, search } = UsersController;

const router = express.Router();

router.post("/registry", checkFormParams, crpytPassword, registry);
router.post("/login", checkFormParams, login);
// 修改个人信息
router.post("", auth, checkIdAndPassExists, checkAllParamsIsNull, modify);
// 注销个人信息
router.delete("", auth, checkIdAndPassExists, logout);
// 查询用户
router.get("", checkPageParams, search);

export default router;