import { Router } from "express";
import restaurantController from "../controllers/restaurantsController.js";
import { authAdmin } from "../middlewares/auth.js";

const router = Router();
router.get("/", authAdmin, restaurantController.getAllRestaurants);
router.get("/:id/", restaurantController.getRestaurantById);
router.get("/:id/products", restaurantController.getRestaurantProducts);
router.put(
  "/:id/product/remove",
  authAdmin,
  restaurantController.removeProductFromRestaurant
);
router.patch(
  "/:id/products",
  authAdmin,
  restaurantController.addProductToRestaurant
);

export default router;
