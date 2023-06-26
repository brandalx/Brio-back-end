import express from "express";
import adminProductsController from "../controllers/adminProductsController.js";
import { authAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", adminProductsController.getAllProducts);
router.get('/productsByCategory', adminProductsController.getProductsByCategory);
router.delete("/:id",authAdmin, adminProductsController.deleteProductById);
router.get("/:id", adminProductsController.getProductById);
router.post("/",authAdmin, adminProductsController.createProduct);
router.patch("/:id",authAdmin, adminProductsController.updateProductById);
router.get('/admin/products', adminProductsController.getProductsByCategory);

export default router;
