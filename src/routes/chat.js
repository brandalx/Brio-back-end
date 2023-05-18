import { Router } from "express";
import chatController from "../controllers/chatController.js";
const router = Router();
router.get("/", chatController.getChat);

export default router;
