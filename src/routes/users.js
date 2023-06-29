import express from "express";
import usersController from "../controllers/usersController.js";
import { auth, authAdmin } from "../middlewares/auth.js";
// TO-DO: add auth middleware
const router = express.Router();
// For each route there is a call to the controller that implements the required logic
// router.get("/", usersController.getUsers);
router.get("/getAllUsers", usersController.getAllUsers);
router.get("/:id", authAdmin, usersController.getUserById);
router.get("/:id/cart", auth, usersController.getUserCart);
router.get("/cart/presummary", auth, usersController.GetPreSummary);
router.get("/:id/address", auth, usersController.getUserAddress);
router.get("/:id/credit-data", auth, usersController.getUserCreditData);
router.get("/orders", auth, usersController.getUserOrders);
router.put("/putuserdata", auth, usersController.putUserData);
router.post("/postuseraddress", auth, usersController.postUserAddress);
router.post("/postusercard", auth, usersController.postUserCard);
router.post("/:id/posttocart", auth, usersController.postToCart);
router.post("/new", usersController.postUser);
router.post("/login", usersController.postLogin);
router.get("/info/user", auth, usersController.getUserInfo);
router.put("/security", auth, usersController.putUserSecurity);

router.delete("/address/delete", auth, usersController.deleteUserAddress);
router.put("/address/edit", auth, usersController.putUserAddress);
router.delete("/card/delete", auth, usersController.deleteUserCard);
router.delete("/cart/delete", auth, usersController.deleteItemCart);
router.put("/card/edit", auth, usersController.putUserCard);
router.post("/user/avatar", auth, usersController.postUserAvatar);
router.post("/:id/notes", authAdmin, usersController.postUserNotes);


export default router;
