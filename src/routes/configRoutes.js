import indexRouter from "./index.js";
import userRouter from "./users.js";
import categoriesRouter from "./categories.js";
import restaurantsRouter from "./restaurants.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";

import { swaggerUiMiddleware } from "../docs/swaggerConfig.js";
export const routesInit = (app) => {
  // here will go all / routers (user)
  app.use("/", indexRouter);
  app.use("/users", userRouter);
  app.use("/categories", categoriesRouter);
  app.use("/restaurants", restaurantsRouter);
  app.use("/products", productsRouter);
  app.use("/orders", ordersRouter);

  // here will go all /admin routers
  //test
  //here will go all swagger atomated docs
  app.use("/api-docs", swaggerUiMiddleware);
  app.use((req, res) => {
    res.status(404).json({
      msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
    });
  });
};
