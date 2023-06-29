import { Router } from "express";
import ordersController from "../controllers/ordersController.js";
import { auth } from "../middlewares/auth.js";
const router = Router();
router.get("/", auth, ordersController.getAllOrders);
router.get("/:id", auth, ordersController.getOrdersById);
router.get("/user/single", auth, ordersController.getUserOrders);
router.post("/createorder", auth, ordersController.postOrder);

export default router;
