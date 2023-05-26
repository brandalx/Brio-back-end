import { Router } from "express";
import productsController from "../controllers/productsController.js";

const router = Router();
router.get("/", productsController.getAllProducts);
router.delete("/:id", productsController.deleteProductById);
router.get("/:id", productsController.getProductById);
router.post("/", productsController.createProduct);
router.patch("/:id", productsController.updateProductById);

export default router;
