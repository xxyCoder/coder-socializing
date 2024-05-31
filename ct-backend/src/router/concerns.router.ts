import concernController from "@src/controller/concern.controller";
import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkPageParams } from "@src/middleware/common.middleware";
import { checkFollowIdx, checkFollwerParams } from "@src/middleware/concern.middware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import express from "express";

const { follwerOrCancel, getFollowers, getFollowList } = concernController;

const router = express.Router();

router.post('/follower_or_cancel', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkFollwerParams, follwerOrCancel)
router.get('/followers', verifyCSRFSession, checkIdAndAccountExists, verifyToken, getFollowers)
router.get('/follow-list', verifyCSRFSession, checkIdAndAccountExists, verifyToken, checkFollowIdx, checkPageParams, getFollowList)

export default router;
