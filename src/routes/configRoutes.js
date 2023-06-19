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

  export const routesInit = (app) => {
    // User routes
    app.use("/", indexRouter);
    app.use("/users", userRouter);
    app.use("/getAllUsers", userRouter);
    app.use("/categories", categoriesRouter);
    app.use("/restaurants", restaurantsRouter);
    app.use("/products", productsRouter);
    app.use("/orders", ordersRouter);

    // Admin restaurants routes
    app.use("/admin/restaurants", adminRestaurantsRouter);
    app.use("/admin/categories", adminCategoriesRouter);
    app.use("/admin/products", adminProductsRouter);
    app.use("/admin/orders", adminOrdersRouter);
    app.use("/admin/promotions", adminPromotionsRouter);
    app.post('/createRestaurantAndAdmin', async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const restaurantData = req.body.restaurant;
        const adminData = req.body.admin;

        const restaurant = new Restaurants(restaurantData);
        await restaurant.save({ session });

        const admin = new UserClientModel(adminData);
        admin.restaurant = restaurant;
        await admin.save({ session });

        await session.commitTransaction();
        await session.endSession();

        const updatedAdmin = await UserClientModel.findById(admin._id); // find the admin again to get the updated data
        res.status(200).send({ restaurant, admin: updatedAdmin });

      } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        res.status(500).send({ error: error.toString() });
      }
    });
    // Swagger API documentation
    app.use("/api-docs", swaggerUiMiddleware);

    // 404 route
    app.use((req, res) => {
      res.status(404).json({
        msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
      });
    });
  };
