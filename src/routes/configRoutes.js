import indexRouter from "./index.js";
import userRouter from "./users.js";
import chatRouter from "./chat.js";
import { swaggerUiMiddleware } from "../docs/swaggerConfig.js";
export const routesInit = (app) => {
  app.use("/", indexRouter);
  app.use("/users", userRouter);
  app.use("/api-docs", swaggerUiMiddleware);
  app.use("/chat", chatRouter);
  app.use((req, res) => {
    res.status(404).json({
      msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
    });
  });
};
