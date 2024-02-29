import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkCommentContent } from "@src/middleware/comment.middleware";
import { checkNoteIdExists } from "@src/middleware/note.middleware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import CommentController from "@src/controller/comment.controller";
import express from "express";

const router = express.Router();

const { emit } = CommentController;

router.get('/note_comments')
router.post('/emit_comment', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkNoteIdExists, checkCommentContent, emit)

export default router;
