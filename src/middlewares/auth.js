import jwt from "jsonwebtoken";

import { tokenSecret1, tokenSecret2 } from "../configs/config.js";

export const auth = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ err: "Please send token to this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, tokenSecret1);
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Token you provided invalid or expired" });
  }
};

export const authAdmin = (req, res, next) => {
  // Checking if a token is sent in the header
  let token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You must send a token to this endpoint" });
  }
  try {
    let decodeToken = jwt.verify(token, tokenSecret2);
    // Checking if the user is an admin
    if (decodeToken.role != "ADMIN") {
      return res
        .status(401)
        .json({ err: "You must send an admin token to this endpoint" });
    }
    // req -> parameter object shared among all functions in the router chain
    req.tokenData = decodeToken;
    // Proceeding to the next function in the router chain
    // next() -> calls the next function in the router chain
    next();
  } catch (err) {
    res.status(401).json({ err: "Token invalid or expired" });
  }
};
