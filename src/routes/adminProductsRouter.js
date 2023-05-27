import express from "express";
import adminProductsController from "../controllers/adminProductsController.js";

const router = express.Router();
router.get("/", adminProductsController.getAllProducts);
router.delete("/:id", adminProductsController.deleteProductById);
router.get("/:id", adminProductsController.getProductById);
router.post("/", adminProductsController.createProduct);
router.patch("/:id", adminProductsController.updateProductById);
export default router;
