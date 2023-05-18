import express from "express";
import indexRouter from "./index.js";
import userRouter from "./users.js";
import categoriesRouter from "./categories.js";
import restaurantsRouter from "./restaurants.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";

import { swaggerUiMiddleware } from "../docs/swaggerConfig.js";
import adminProductsController from "../controllers/adminProductsController.js";
import adminRestaurantsController from "../controllers/adminRestaurantsController.js";

export const routesInit = (app) => {

//user routes
  app.use("/", indexRouter);
  app.use("/users", userRouter);
  app.use("/categories", categoriesRouter);
  app.use("/restaurants", restaurantsRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);

// admin restaurants routes
  app.get(
    "/getRestaurantById/:id",
    adminRestaurantsController.getRestaurantById
  );
  app.get(
    "/adminGetRestaurantsMenu/:id",
    adminRestaurantsController.adminGetRestaurantsMenu
  );
  app.get("/getAllOrders", adminProductsController.getAllOrders);
  app.get("/getProductById/:id", adminProductsController.getProductById);
  app.get("/getOrderById/:id", adminProductsController.getOrderById);

  // Swagger API documentation
  app.use("/api-docs", swaggerUiMiddleware);

  // 404 route
  app.use((req, res) => {
    res.status(404).json({
      msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
    });
  });
};
