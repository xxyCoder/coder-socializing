import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkNotifyIdExists, checkTypeRight } from "@src/middleware/notify.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import NotifyController from "@src/controller/notify.controller";
import express from "express";
import { checkPageParams } from "@src/middleware/common.middleware";

const router = express.Router();

const { list: getNotifyList, changeStatus } = NotifyController;

router.get('/notify_list', verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkPageParams, checkTypeRight, getNotifyList)
router.post('/change_status', verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkNotifyIdExists, changeStatus)

export default router