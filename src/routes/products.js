import { Router } from "express";
import productsController from "../controllers/productsController.js";

const router = Router();
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", productsController.createProduct);

export default router;
