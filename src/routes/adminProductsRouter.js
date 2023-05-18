import express from "express";
import adminProductsController from "../controllers/adminProductsController.js";

const router = express.Router();
router.get("/:id", adminProductsController.getProductById);


export default router;
