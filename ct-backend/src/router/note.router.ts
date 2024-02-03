import { checkLikeParams, checkNoteParams } from '@src/middleware/note.middleware'
import { checkIdAndAccountExists } from '@src/middleware/users.middleware'
import NotesController from '@src/controller/notes.controller'
import express from 'express'
import multer from 'multer'
import { storage } from '@src/middleware/common.middleware'
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware'

const router = express.Router()
const { like, publish } = NotesController

router.post("/like", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkLikeParams, like);

const uploadMedia = multer({
    storage,
    limits: {
        files: 6 // 限制最多上传六个文件
    }
})
router.post("/publish", checkIdAndAccountExists, verifyToken, verifyCSRFSession, uploadMedia.array('mediaList', 6), checkNoteParams, publish);

export default router
