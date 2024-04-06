import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkPageParams } from "@src/middleware/common.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import ChatController from "@src/controller/chat.controller";
import express from "express";
import { checkChatContent, checkChatReceiverId } from "@src/middleware/chat.middleware";

const router = express.Router()
const { getChatList, addChatBar, getChatContent } = ChatController

router.get('/chat_list', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkPageParams, getChatList)
router.post('/add_chat_bar', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkChatReceiverId, checkChatContent, addChatBar)
router.get('/chat_content', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkPageParams, checkChatReceiverId, getChatContent)

export default router