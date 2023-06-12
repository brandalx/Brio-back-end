import express from "express";
import adminProductsController from "../controllers/adminProductsController.js";

const router = express.Router();
router.get("/admin/products/:id", adminProductsController.getProductById);

// GET /admin/orders
router.get("/admin/orders", adminProductsController.getAllOrders);

// GET /admin/orders/:id
router.get("/admin/orders/:id", adminProductsController.getOrderById);

export default router;
