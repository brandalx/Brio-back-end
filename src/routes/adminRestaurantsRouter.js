import express from "express";
import adminRestaurantsController from "../controllers/adminRestaurantsController.js";

const router = express.Router();

router.get("/:id", adminRestaurantsController.getRestaurantById);

// GET /admin/restaurants/:id/menu
router.get("/:id/menu", adminRestaurantsController.adminGetRestaurantsMenu);

export default router;
