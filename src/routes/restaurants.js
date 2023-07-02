import { Router } from "express";
import restaurantController from "../controllers/restaurantsController.js";
import { auth, authAdmin } from "../middlewares/auth.js";

const router = Router();
router.get("/", restaurantController.getAllRestaurants);
router.post("/comment/add", auth, restaurantController.postUserComment);
router.post("/comment/add/like", auth, restaurantController.postUserLike);
router.post("/comment/add/dislike", auth, restaurantController.postUserDislike);
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
