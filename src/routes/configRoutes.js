import indexRouter from "./index.js";
import userRouter from "./users.js";

export const routesInit = (app) => {
  app.use("/", indexRouter);
  app.use("/users", userRouter);

  app.use((req, res) => {
    res.status(404).json({
      msg: "Error 404: The page you are looking for could not be found. Please check the URL and try again",
    });
  });
};
