import mongoose from "mongoose";
// Schema to make request to the Mongo DB

let schema = new mongoose.Schema({
  name: String,
  // todo: add roles
});
export const companiesModel = mongoose.model("companies", schema);

//todo: correct model according on future requests (in future releases)
