import { Router } from "express";
import ordersController from "../controllers/ordersController.js";
import { auth } from "../middlewares/auth.js";
const router = Router();
router.get("/", auth, ordersController.getAllOrders);
router.get("/:id", ordersController.getOrdersById);
router.post("/:id", ordersController.postOrder);

export default router;
