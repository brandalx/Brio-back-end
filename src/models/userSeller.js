import mongoose from "mongoose";

let schema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  company: String,
  //todo: add roles
});
export const userSellerModel = mongoose.model("usersSeller", schema);

//todo: correct model according on future requests (in future releases)
