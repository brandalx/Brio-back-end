import { Router } from "express";
import restaurantController from "../controllers/restaurantsController.js";

const router = Router();
router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);

export default router;
