import { UserClientModel } from "../models/userClient.js";

export const checkUserExists = async (req, res, next) => {
  let user = await UserClientModel.findById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  req.user = user;
  next();
};
