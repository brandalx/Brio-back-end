import { Router } from "express";
import restaurantController from "../controllers/restaurantsController.js";

const router = Router();
router.get("/", restaurantController.getAllRestaurants);

export default router;
