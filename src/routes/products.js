import { Router } from "express";
import productsController from "../controllers/productsController.js";

const router = Router();
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.get("/single/limit", productsController.getLimitedProducts);
router.get("/single/search", productsController.getSearchProducts);

export default router;
