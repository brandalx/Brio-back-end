import express from "express";
import adminRestaurantsController from "../controllers/adminRestaurantsController.js";
import { authAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", adminRestaurantsController.getAllRestaurants);
router.get("/:id", adminRestaurantsController.getRestaurantById);
router.patch(
  "/:id",
  authAdmin,
  adminRestaurantsController.updateRestaurantById
);
router.get("/:id", adminRestaurantsController.updateRestaurantById);
router.get("/:id/products", adminRestaurantsController.getRestaurantProducts);
router.get("/:id/menu", adminRestaurantsController.adminGetRestaurantsMenu);

export default router;
