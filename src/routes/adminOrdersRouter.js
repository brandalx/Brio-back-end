import express from "express";
import adminOrdersController from "../controllers/adminOrdersController.js";

const router = express.Router();

router.get("/:id", adminOrdersController.getOrderById);
router.get("/", adminOrdersController.getAllOrders);

export default router;