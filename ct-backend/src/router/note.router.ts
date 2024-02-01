import { checkLikeParams } from '@src/middleware/note.middleware'
import { checkIdAndAccountExists } from '@src/middleware/users.middleware'
import NotesController from '@src/controller/notes.controller'
import express from 'express'

const router = express.Router()
const { like } = NotesController

router.post("/like", checkIdAndAccountExists, checkLikeParams, like);

export default router
