import jwt from "jsonwebtoken";

import { tokenSecret1, tokenSecret2 } from "../configs/config.js";

const auth = (req, res, next) => {
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

export default auth;
