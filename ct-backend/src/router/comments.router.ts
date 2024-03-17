import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkCommentContent, checkCommentIdExists } from "@src/middleware/comment.middleware";
import { checkNoteIdExists } from "@src/middleware/note.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import CommentController from "@src/controller/comment.controller";
import express from "express";
import { checkPageParams } from "@src/middleware/common.middleware";

const router = express.Router();

const { emit, list, notifyList } = CommentController;

router.get('/note_comments', verifyCSRFSession, checkNoteIdExists, checkPageParams, list)
router.post('/emit_comment', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkNoteIdExists, checkCommentContent, emit)
router.get("/note_notify_comment", verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkCommentIdExists, notifyList)


export default router;
