import express from "express";
import adminCategoriesController from "../controllers/adminCategoriesController.js";
import { authAdmin } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", adminCategoriesController.getAllCategories);
router.get("/:id", adminCategoriesController.getCategoryById);
router.post("/", authAdmin, adminCategoriesController.createCategory);
export default router;
