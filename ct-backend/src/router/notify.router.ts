import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkTypeRight } from "@src/middleware/notify.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import NotifyController from "@src/controller/notify.controller";
import express from "express";

const router = express.Router();

const { list: getNotifyList } = NotifyController;

router.get('/notify_list', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkTypeRight, getNotifyList)

export default router