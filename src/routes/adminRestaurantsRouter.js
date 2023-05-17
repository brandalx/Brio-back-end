import express from "express";
import adminRestaurantsController from "../controllers/adminRestaurantsController.js";

const router = express.Router();

router.get(
  "/admin/restaurants/:id",
  adminRestaurantsController.getRestaurantById
);

// GET /admin/restaurants/:id/menu
router.get(
  "/admin/restaurants/:id/menu",
  adminRestaurantsController.adminGetRestaurantsMenu
);

export default router;
