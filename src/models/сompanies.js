import mongoose from "mongoose";
// Schema to make request to the Mongo DB

let schema = new mongoose.Schema({
  id: Number,
  name: String,
  // todo: add roles

  title: String,
  address: String,
  location: String,
  image: String,
  reviews: Object,
  company: String,
  products: Array,
});
export const companiesModel = mongoose.model("companies", schema);
//todo: correct model according on future requests (in future releases)
