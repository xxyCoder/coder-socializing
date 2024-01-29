import concernController from "@src/controller/concern.controller";
import { checkFollwerParams } from "@src/middleware/concern.middware";
import express from "express";

const { follwerOrCancel } = concernController;

const router = express.Router();

router.post('/follower_or_cancel', checkFollwerParams, follwerOrCancel)

export default router;
