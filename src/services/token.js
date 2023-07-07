import jwt from "jsonwebtoken";
import { tokenSecret1 } from "../configs/config.js";
export function createToken(user_id, role, time = "24hours") {
  //          ===>           PLEASE MENTION: [THIS] KEY WILL BE CHANGED WHEN WILL BE DEPLOYED TO THE REAL SERVER
  //                                           \/
  //                       payload    | the secret key |  options object (will expire in 60 minutes)
  let token = jwt.sign({ _id: user_id, role }, tokenSecret1, {
    expiresIn: time,
  });
  return token;
}
