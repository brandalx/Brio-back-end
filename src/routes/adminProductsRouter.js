import express from "express";
import adminProductsController from "../controllers/adminProductsController.js";

const router = express.Router();
router.get("/:id", adminProductsController.getProductById);
router.get("/products", adminProductsController.getAllProducts);

export default router;
