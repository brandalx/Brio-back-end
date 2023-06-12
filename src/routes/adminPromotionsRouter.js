import { Router } from "express";
import AdminPromotionsController from "../controllers/adminPromotionsController.js";

const router = Router();
router.get("/", AdminPromotionsController.getAllPromotions);
router.post("/", AdminPromotionsController.createPromotion);

export default router;
