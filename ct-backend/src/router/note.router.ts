import { checkLikeParams } from '@src/middleware/note.middleware'
import { checkIdAndAccountExists } from '@src/middleware/users.middleware'
import express from 'express'

const router = express.Router()

router.post("/like", checkIdAndAccountExists, checkLikeParams)

export default router
