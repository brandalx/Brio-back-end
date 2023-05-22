import { Router } from "express";
import categoriesController from "../controllers/categoriesControllers.js";

const router = Router();
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);
router.post("/", categoriesController.createCategory);

export default router;
