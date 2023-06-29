import { Router } from "express";
import restaurantController from "../controllers/restaurantsController.js";
import { auth, authAdmin } from "../middlewares/auth.js";

const router = Router();
router.get("/", restaurantController.getAllRestaurants);
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
