import concernController from "@src/controller/concern.controller";
import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkPageParams } from "@src/middleware/common.middleware";
import { checkFollowIdx, checkFollowViewerId, checkFollwerParams } from "@src/middleware/concern.middware";
import { checkIdAndAccountExists } from "@src/middleware/users.middleware";
import express from "express";

const { follwerOrCancel, getFollowers, getFollowList } = concernController;

const router = express.Router();

router.post('/follower_or_cancel', verifyCSRFSession, verifyToken, checkIdAndAccountExists, checkFollwerParams, follwerOrCancel)
router.get('/followers', verifyCSRFSession, checkFollowViewerId, getFollowers)
router.get('/follow-list', verifyCSRFSession, checkFollowIdx, checkFollowViewerId, checkPageParams, getFollowList)

export default router;
