import express from "express";
import adminCategoriesController from "../controllers/adminCategoriesController.js";

const router = express.Router();
router.get("/", adminCategoriesController.getAllCategories);
router.get("/:id", adminCategoriesController.getCategoryById);
router.post("/", adminCategoriesController.createCategory);
export default router;
