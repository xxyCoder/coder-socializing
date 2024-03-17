import concernController from "@src/controller/concern.controller";
import { verifyCSRFSession, verifyToken } from "@src/middleware/auth.middleware";
import { checkFollwerParams } from "@src/middleware/concern.middware";
import express from "express";

const { follwerOrCancel } = concernController;

const router = express.Router();

router.post('/follower_or_cancel', verifyToken, verifyCSRFSession, checkFollwerParams, follwerOrCancel)

export default router;
