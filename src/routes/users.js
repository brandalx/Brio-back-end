import express from "express";
import usersController from "../controllers/usersController.js";
// TO-DO: add auth middleware
const router = express.Router();
// For each route there is a call to the controller that implements the required logic
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.get("/:id/cart", usersController.getUserCart);

export default router;
