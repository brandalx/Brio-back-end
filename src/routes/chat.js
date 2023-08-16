import { Router } from "express";
import categoriesController from "../controllers/categoriesControllers.js";
import chatController from "../controllers/chatController.js";

const router = Router();
router.post("/message", chatController.questionResponse);

export default router;
