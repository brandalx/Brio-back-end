import { Router } from "express";
import chatController from "../controllers/chatController.js";
const router = Router();
router.get("/", chatController.getChat);
router.post("/send", chatController.postChat);

export default router;
