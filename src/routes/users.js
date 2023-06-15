import express from "express";
import usersController from "../controllers/usersController.js";
import auth from "../middlewares/auth.js";
// TO-DO: add auth middleware
const router = express.Router();
// For each route there is a call to the controller that implements the required logic
// router.get("/", usersController.getUsers);
router.get("/getAllUsers", usersController.getAllUsers);
router.get("/", auth, usersController.getUserById);
router.get("/:id/cart", usersController.getUserCart);
router.get("/:id/address", usersController.getUserAddress);
router.get("/:id/credit-data", usersController.getUserCreditData);

router.get("/:id/orders", usersController.getUserOrders);
router.put("/:id/putuserdata", usersController.putUserData);
router.post("/postuseraddress", auth, usersController.postUserAddress);
router.post("/:id/postusercard", usersController.postUserCard);
router.post("/:id/posttocart", usersController.postToCart);
router.post("/new", usersController.postUser);
router.post("/login", usersController.postLogin);
router.get("/info/user", auth, usersController.getUserInfo);
router.put("/security", auth, usersController.putUserSecurity);

export default router;
