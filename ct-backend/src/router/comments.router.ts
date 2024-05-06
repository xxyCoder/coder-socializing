import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkCommentContent, checkCommentIdExists } from "@src/middleware/comment.middleware";
import { checkNoteIdExists } from "@src/middleware/note.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import CommentController from "@src/controller/comment.controller";
import express from "express";
import { checkPageParams } from "@src/middleware/common.middleware";

const router = express.Router();

const { emit, list, notifyList, removeComment } = CommentController;

router.get('/note_comments', checkNoteIdExists, checkPageParams, list)
router.post('/emit_comment', verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkNoteIdExists, checkCommentContent, emit)
router.get("/note_notify_comment", verifyToken, verifyCSRFSession, checkIdAndAccountExists, checkCommentIdExists, notifyList)
router.delete("/delete_comment", checkIdAndAccountExists, verifyCSRFSession, verifyToken, checkNoteIdExists, checkCommentIdExists, removeComment)

export default router;
