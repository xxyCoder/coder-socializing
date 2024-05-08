import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkNotifyIdExists, checkTagRight } from "@src/middleware/notify.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import NotifyController from "@src/controller/notify.controller";
import express from "express";
import { checkPageParams } from "@src/middleware/common.middleware";

const router = express.Router();

const { list: getNotifyList, changeStatus, getNotifyCnt, clearNotify } = NotifyController;

router.get('/notify_list', verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkPageParams, checkTagRight, getNotifyList)
router.post('/change_status', verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkNotifyIdExists, changeStatus)
router.get('/notify_cnt', checkIdAndAccountExists, verifyCSRFSession, verifyToken, getNotifyCnt)
router.post('/clear_notify', checkIdAndAccountExists, verifyCSRFSession, verifyToken, checkTagRight, clearNotify)

export default router