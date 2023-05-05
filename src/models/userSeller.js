import mongoose from "mongoose";
// Schema to make request to the Mongo DB

let schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  company: String,
  //todo: add roles
});
export const userSellerModel = mongoose.model("usersSeller", schema);
