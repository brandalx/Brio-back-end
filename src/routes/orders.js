import { Router } from "express";
import ordersController from "../controllers/ordersController.js";

const router = Router();
router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrdersById);
router.post("/:id", ordersController.postOrder);

export default router;
