import express from "express";
import usersController from "../controllers/usersController.js";
import { auth } from "../middlewares/auth.js";
// TO-DO: add auth middleware
const router = express.Router();
// For each route there is a call to the controller that implements the required logic
// router.get("/", usersController.getUsers);
router.get("/getAllUsers", usersController.getAllUsers);
router.get("/", auth, usersController.getUserById);
router.get("/:id/cart", auth, usersController.getUserCart);
router.get("/:id/address", auth, usersController.getUserAddress);
router.get("/:id/credit-data", auth, usersController.getUserCreditData);
router.get("/orders", auth, usersController.getUserOrders);
router.put("/:id/putuserdata", auth, usersController.putUserData);
router.post("/postuseraddress", auth, usersController.postUserAddress);
router.post("/:id/postusercard", auth, usersController.postUserCard);
router.post("/:id/posttocart", auth, usersController.postToCart);
router.post("/new", usersController.postUser);
router.post("/login", usersController.postLogin);
router.get("/info/user", auth, usersController.getUserInfo);
router.put("/security", auth, usersController.putUserSecurity);
router.post("/:id/notes", usersController.postUserNotes);

export default router;
