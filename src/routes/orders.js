import { Router } from "express";
import ordersController from "../controllers/ordersController.js";

const router = Router();
router.get("/", ordersController.getAllOrders);

export default router;
