import express from "express";
import indexRouter from "./index.js";
import userRouter from "./users.js";
import categoriesRouter from "./categories.js";
import restaurantsRouter from "./restaurants.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import { swaggerUiMiddleware } from "../docs/swaggerConfig.js";
import adminOrdersRouter from "./adminOrdersRouter.js";
import adminProductsRouter from "./adminProductsRouter.js";
import adminCategoriesRouter from "./adminCategoriesRouter.js";

import adminRestaurantsRouter from "./adminRestaurantsRouter.js";
import adminPromotionsRouter from "./adminPromotionsRouter.js";
import mongoose from "mongoose";
import Restaurants from "../models/restaurants.js";
import { UserClientModel } from "../models/userClient.js";
import router from "./restaurants.js";
import { authAdmin } from "../middlewares/auth.js";
import bcrypt from "bcrypt";

export const routesInit = (app) => {
  // User routes
  app.use("/api/", indexRouter);
  app.use("/api/users", userRouter);
  app.use("/api/getAllUsers", userRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/restaurants", restaurantsRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);

  // Admin restaurants routes
  app.use("/api/admin/restaurants", adminRestaurantsRouter);
  app.use("/api/admin/categories", adminCategoriesRouter);
  app.use("/api/admin/products", adminProductsRouter);
  app.use("/api/admin/orders", adminOrdersRouter);
  app.use("/api/admin/promotions", adminPromotionsRouter);
  // Swagger API documentation
  app.use("/api/api-docs", swaggerUiMiddleware);

  // 404 route
  app.use((req, res) => {
    res.status(404).json({
      msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
    });
  });
};
